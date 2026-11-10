import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Paperclip,
  Trash2,
  AlertCircle,
  RotateCcw,
  Headphones,
  Zap,
  CheckCircle2,
  Video,
  VideoOff,
  Camera,
  RefreshCw,
  Scan,
  Focus,
  Eye,
  Radio
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { cleanDuplicateSpeech, processSpeechEvent } from '../utils/speechUtils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  imageUrl?: string;
  isVideoFrame?: boolean;
}

interface AIVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  initialMode?: 'voice' | 'video';
  onOpenLiveVideo?: () => void;
}

export const AIVoiceModal: React.FC<AIVoiceModalProps> = ({
  isOpen,
  onClose,
  language,
  initialMode = 'voice',
  onOpenLiveVideo,
}) => {
  const t = TRANSLATIONS[language];
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content:
        language === 'punjabi'
          ? 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰ ਜੀ! ਮੈਂ ਡਿਜੀਟਲ ਕਿਸਾਨ ਸਾਥੀ ਹਾਂ। ਖੇਤੀ, ਫਸਲਾਂ ਦੀ ਬਿਮਾਰੀ, ਖਾਦਾਂ, ਮੰਡੀ ਭਾਅ ਜਾਂ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਬਾਰੇ ਕੋਈ ਵੀ ਸਵਾਲ ਬੋਲ ਕੇ ਜਾਂ ਲਿਖ ਕੇ ਪੁੱਛੋ।'
          : language === 'hindi'
          ? 'नमस्ते किसान भाई! मैं डिजिटल किसान साथी हूँ। फसल, रोग नियंत्रण, खाद की खुराक, मंडी भाव या सरकारी योजनाओं के बारे में बोलकर या लिखकर पूछें।'
          : 'Sat Sri Akal! I am Digital Kisan Sathi AI. Ask any question about crops, fertilizers, pest control, mandi rates, or Punjab government schemes by voice or text.',
      timestamp: 'Just now',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoSend, setAutoSend] = useState(true);
  const [isAutoSending, setIsAutoSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);

  // Live Video & Camera State
  const [activeMode, setActiveMode] = useState<'voice' | 'video'>(initialMode);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanningFrame, setIsScanningFrame] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const silenceTimerRef = useRef<any>(null);
  const lastSpeechTextRef = useRef('');
  const userWantsListeningRef = useRef(false);
  const isSendingRef = useRef(false);
  const restartCountRef = useRef(0);
  const autoSendRef = useRef(true);
  const handleSendMessageRef = useRef<(text?: string) => Promise<void>>(async () => {});

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async (targetFacing: 'environment' | 'user' = facingMode) => {
    stopCamera();
    setCameraError(null);
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: targetFacing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Initial camera constraint failed, retrying generic video:', err);
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = fallbackStream;
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          videoRef.current.play().catch(() => {});
        }
        setIsCameraActive(true);
      } catch (e2) {
        console.warn('Camera failed:', e2);
        setCameraError(
          language === 'punjabi'
            ? 'ਕੈਮਰਾ ਚਾਲੂ ਕਰਨ ਵਿੱਚ ਦਿੱਕਤ ਆਈ। ਕਿਰਪਾ ਕਰਕੇ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਕੈਮਰੇ ਦੀ ਆਗਿਆ (Allow Camera) ਦਿਓ।'
            : 'कैमरा शुरू करने में समस्या आई। कृपया ब्राउज़र में कैमरा की अनुमति दें।'
        );
        setIsCameraActive(false);
      }
    }
  };

  const switchCamera = () => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    startCamera(next);
  };

  const captureVideoSnapshot = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video.videoWidth || !video.videoHeight) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    try {
      return canvas.toDataURL('image/jpeg', 0.85);
    } catch (e) {
      return null;
    }
  };

  const toggleVideoMode = (enable?: boolean) => {
    const shouldEnable = enable !== undefined ? enable : activeMode !== 'video';
    if (shouldEnable) {
      if (onOpenLiveVideo) {
        stopCamera();
        onClose();
        onOpenLiveVideo();
        return;
      }
      setActiveMode('video');
      startCamera(facingMode);
    } else {
      setActiveMode('voice');
      stopCamera();
    }
  };

  // Sync isOpen and initialMode
  useEffect(() => {
    if (isOpen) {
      if (initialMode === 'video') {
        setActiveMode('video');
        startCamera('environment');
      }
    } else {
      stopCamera();
      setActiveMode('voice');
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Keep autoSendRef in sync
  useEffect(() => {
    autoSendRef.current = autoSend;
  }, [autoSend]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Hands-free auto-send when person stops talking
  const triggerAutoSend = (textToSend: string) => {
    if (isSendingRef.current) return;
    const cleaned = cleanDuplicateSpeech(textToSend);
    if (!cleaned) return;

    isSendingRef.current = true;
    setIsAutoSending(true);
    userWantsListeningRef.current = false;

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    try {
      recognitionRef.current?.stop();
    } catch (e) {
      // ignore
    }
    setIsListening(false);

    // Brief 350ms delay so farmer sees visual confirmation of auto-send
    setTimeout(() => {
      handleSendMessageRef.current(cleaned);
      lastSpeechTextRef.current = '';
      setIsAutoSending(false);
      setTimeout(() => {
        isSendingRef.current = false;
      }, 500);
    }, 350);
  };

  // Initialize Speech Recognition instance on mount
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in this browser. Please type your question.');
      return;
    }

    if (isListening) {
      userWantsListeningRef.current = false;
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      setIsListening(false);
      return;
    }

    userWantsListeningRef.current = true;
    restartCountRef.current = 0;
    lastSpeechTextRef.current = '';
    setInputQuery('');

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechSupported(false);
        return;
      }

      // Abort any lingering instance
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }

      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      rec.lang = language === 'punjabi' ? 'pa-IN' : language === 'hindi' ? 'hi-IN' : 'en-IN';

      rec.onstart = () => {
        setIsListening(true);
        restartCountRef.current = 0;
      };

      rec.onresult = (event: any) => {
        const cleaned = processSpeechEvent(event);
        if (cleaned) {
          lastSpeechTextRef.current = cleaned;
          setInputQuery(cleaned);

          // Reset silence timer for auto-send
          if (autoSendRef.current) {
            if (silenceTimerRef.current) {
              clearTimeout(silenceTimerRef.current);
            }
            silenceTimerRef.current = setTimeout(() => {
              const text = cleanDuplicateSpeech(lastSpeechTextRef.current.trim());
              if (text && text.length > 0 && !isSendingRef.current) {
                triggerAutoSend(text);
              }
            }, 1250);
          }
        }
      };

      rec.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);
        if (event.error === 'no-speech' || event.error === 'aborted') {
          return;
        }
        setIsListening(false);
        userWantsListeningRef.current = false;
        if (event.error === 'not-allowed') {
          alert(
            language === 'punjabi'
              ? 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਮਾਈਕ੍ਰੋਫ਼ੋਨ ਦੀ ਆਗਿਆ ਦਿਓ (Allow Microphone)।'
              : 'कृपया अपने ब्राउज़र में माइक्रोफ़ोन की अनुमति दें (Allow Microphone)।'
          );
        }
      };

      rec.onend = () => {
        const pending = cleanDuplicateSpeech(lastSpeechTextRef.current.trim());
        if (pending && autoSendRef.current && !isSendingRef.current) {
          triggerAutoSend(pending);
          return;
        }
        setIsListening(false);
        userWantsListeningRef.current = false;
      };

      recognitionRef.current = rec;
      rec.start();
      setIsListening(true);
    } catch (err: any) {
      console.warn('Recognition start exception:', err);
      setIsListening(false);
    }
  };

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Pre-load speech voices for mobile and desktop browsers
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) {
        setAvailableVoices(v);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Web Audio tone to indicate response arrival
  const playChimeTone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // ignore
    }
  };

  // Text-to-speech functionality
  const speakText = (text: string, msgId?: string) => {
    if (!('speechSynthesis' in window) || !voiceEnabled) return;

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
    } catch (e) {
      // ignore
    }

    if (activeSpeakingId === msgId) {
      setActiveSpeakingId(null);
      return;
    }

    // Clean text of markdown and technical chars
    const cleanSpeech = text
      .replace(/[*_#`~]/g, '')
      .replace(/\(.*?\)/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim();

    if (!cleanSpeech) return;

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.volume = 1.0;
    utterance.rate = 0.92; // Slightly paced for clarity in rural and farming context
    utterance.pitch = 1.0;

    // Pick suitable voice from loaded list
    const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
    let selectedVoice: SpeechSynthesisVoice | null = null;

    if (language === 'punjabi') {
      // Check for Punjabi voice first
      selectedVoice = voices.find((v) => v.lang.startsWith('pa') || v.name.toLowerCase().includes('punjabi')) || null;
      // If not present, fallback to Indian Hindi voice (pre-installed on all Android phones & Windows in India)
      if (!selectedVoice) {
        selectedVoice = voices.find((v) => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi')) || null;
      }
    } else if (language === 'hindi') {
      selectedVoice = voices.find((v) => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi')) || null;
    }

    if (!selectedVoice) {
      selectedVoice = voices.find((v) => v.lang.includes('en-IN') || v.lang.includes('hi') || v.lang.startsWith('en')) || null;
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = 'hi-IN'; // Default Indian phonetic TTS
    }

    if (msgId) setActiveSpeakingId(msgId);

    utterance.onstart = () => {
      if (msgId) setActiveSpeakingId(msgId);
    };

    utterance.onend = () => {
      setActiveSpeakingId(null);
    };

    utterance.onerror = (e) => {
      console.warn('Speech error:', e);
      setActiveSpeakingId(null);
    };

    // Small delay ensures previous cancel is cleared
    setTimeout(() => {
      try {
        window.speechSynthesis.resume();
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error('Failed to trigger speech:', err);
      }
    }, 40);
  };

  const handleTestSpeaker = () => {
    const testPhrase =
      language === 'punjabi'
        ? 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰ ਜੀ! ਤੁਹਾਡਾ ਸਪੀਕਰ ਬਿਲਕੁਲ ਸਹੀ ਕੰਮ ਕਰ ਰਿਹਾ ਹੈ।'
        : 'नमस्ते किसान भाई! आपका स्पीकर बिल्कुल सही काम कर रहा है।';
    speakText(testPhrase, 'test-speaker');
  };

  const handleSendMessage = async (textToSend?: string) => {
    const rawText = (textToSend || inputQuery).trim();
    const text = cleanDuplicateSpeech(rawText);

    // If live video is active and no image was picked manually, capture the current video frame!
    let imageToAttach = selectedImage;
    let isVideoFrameAttached = false;
    if (!imageToAttach && activeMode === 'video' && isCameraActive) {
      setIsScanningFrame(true);
      const snap = captureVideoSnapshot();
      if (snap) {
        imageToAttach = snap;
        isVideoFrameAttached = true;
      }
      setTimeout(() => setIsScanningFrame(false), 500);
    }

    if (!text && !imageToAttach) return;

    const defaultVideoPrompt =
      language === 'punjabi'
        ? 'ਕਿਰਪਾ ਕਰਕੇ ਇਸ ਵੀਡੀਓ ਵਿੱਚ ਦਿਖ ਰਹੀ ਫਸਲ, ਇਸਦੇ ਪੱਤਿਆਂ ਦੀ ਬਿਮਾਰੀ ਜਾਂ ਕੀੜੇ ਦੀ ਜਾਂਚ ਕਰੋ ਅਤੇ PAU ਸਿਫ਼ਾਰਸ਼ਾਂ ਅਨੁਸਾਰ ਤੁਰੰਤ ਦਵਾਈ ਤੇ ਖੁਰਾਕ ਦੱਸੋ।'
        : language === 'hindi'
        ? 'कृपया इस वीडियो में दिख रही फसल की बीमारी की जांच करें और PAU अनुसार दवा व खुराक बताएं।'
        : 'Please examine the crop visible in this video, identify any disease or pest, and provide PAU treatment dosage.';

    const userMsgId = `user-${Date.now()}`;
    const newMsg: Message = {
      id: userMsgId,
      role: 'user',
      content: text || (imageToAttach ? defaultVideoPrompt : 'ਸਵਾਲ'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrl: imageToAttach || undefined,
      isVideoFrame: isVideoFrameAttached,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputQuery('');
    setSelectedImage(null);
    setIsLoading(true);

    const getLocalAgriAdvice = (qText: string) => {
      const q = qText.toLowerCase();

      // 1. Vegetables (ਸਬਜ਼ੀਆਂ / सब्जियां / आलू / टमाटर / मटर / गोभी / गाजर / मूली / मिर्च / प्याज / लहसुन)
      if (
        q.includes('ਸਬਜੀ') || q.includes('ਸਬਜ਼ੀ') || q.includes('sabji') || q.includes('sabzi') ||
        q.includes('vegetable') || q.includes('ਆਲੂ') || q.includes('aloo') || q.includes('potato') ||
        q.includes('ਟਮਾਟਰ') || q.includes('tamatar') || q.includes('tomato') ||
        q.includes('ਗੋਭੀ') || q.includes('gobhi') || q.includes('cauliflower') || q.includes('cabbage') ||
        q.includes('ਮਟਰ') || q.includes('matar') || q.includes('pea') ||
        q.includes('ਪਿਆਜ਼') || q.includes('pyaz') || q.includes('onion') ||
        q.includes('ਲਸਣ') || q.includes('lasan') || q.includes('garlic') ||
        q.includes('ਮਿਰਚ') || q.includes('mirch') || q.includes('chili') ||
        q.includes('ਗਾਜਰ') || q.includes('gajar') || q.includes('carrot') ||
        q.includes('ਮੂਲੀ') || q.includes('mooli') || q.includes('radish') ||
        q.includes('ਪਾਲਕ') || q.includes('palak') || q.includes('spinach')
      ) {
        if (q.includes('ਆਲੂ') || q.includes('aloo') || q.includes('potato')) {
          return language === 'punjabi'
            ? 'ਆਲੂ ਦੀ ਖੇਤੀ (PAU ਸਿਫ਼ਾਰਸ਼ਾਂ): ਕਫ਼ਰੀ ਪੁਖਰਾਜ ਅਤੇ ਕਫ਼ਰੀ ਜੋਤੀ ਪ੍ਰਮੁੱਖ ਕਿਸਮਾਂ ਹਨ। ਬੀਜ ਨੂੰ ਮੈਨਕੋਜ਼ੇਬ (ਡਾਈਥੇਨ ਐੱਮ-45) @ 2.5 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਨਾਲ ਸੋਧੋ। ਪਛੇਤੇ ਝੁਲਸ ਰੋਗ ਤੋਂ ਬਚਾਅ ਲਈ ਰਿਡੋਮਿਲ ਗੋਲਡ 2 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਸਪਰੇਅ ਕਰੋ। ਸਿੰਚਾਈ ਹਲਕੀ ਅਤੇ 7-10 ਦਿਨਾਂ ਦੇ ਵਕਫੇ ਤੇ ਕਰੋ।'
            : 'आलू की खेती: कुफरी पुखराज और कुफरी ज्योति मुख्य किस्में हैं। बीज को मैंकोजेब 2.5 ग्राम/लीटर से उपचारित करें। पिछेता झुलसा से बचाव हेतु रिडोमिल गोल्ड 2 ग्राम/लीटर का छिड़काव करें।';
        }
        if (q.includes('ਟਮਾਟਰ') || q.includes('tamatar') || q.includes('tomato')) {
          return language === 'punjabi'
            ? 'ਟਮਾਟਰ ਦੀ ਕਾਸ਼ਤ: ਫਲ ਛੇਦਕ ਸੁੰਡੀ ਲਈ ਕੋਰਾਜਨ 60 ਮਿ.ਲੀ. ਪ੍ਰਤੀ ਏਕੜ ਛਿੜਕੋ। ਚਿੱਟੀ ਮੱਖੀ ਅਤੇ ਪੱਤਾ ਮਰੋੜ ਰੋਗ ਤੋਂ ਬਚਾਅ ਲਈ ਥਾਇਆਮੈਥੋਕਸਮ 25% WG @ 80 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਏਕੜ ਸਪਰੇਅ ਕਰੋ। ਤੁਪਕਾ ਸਿੰਚਾਈ (Drip) ਨਾਲ ਪਾਣੀ ਬਚਦਾ ਹੈ ਅਤੇ ਪੈਦਾਵਾਰ ਵੱਧਦੀ ਹੈ।'
            : 'टमाटर की खेती: फल छेदक सुंडी हेतु कोराजन 60 मिली/एकड़ का छिड़काव करें। सफेद मक्खी व पत्ता मरोड़ के लिए थायमेथोक्सम 80 ग्राम/एकड़ डालें। ड्रिप सिंचाई से पैदावार बढ़ती है।';
        }
        if (q.includes('ਮਟਰ') || q.includes('matar') || q.includes('pea')) {
          return language === 'punjabi'
            ? 'ਮਟਰ ਦੀ ਖੇਤੀ: ਮਟਰ ਅਗੇਤਾ-7 ਅਤੇ ਏ.ਪੀ.-3 ਵਧੀਆ ਕਿਸਮਾਂ ਹਨ। ਪ੍ਰਤੀ ਏਕੜ 35-40 ਕਿੱਲੋ ਬੀਜ ਵਰਤੋ। ਚੂਰਨ ਰੋਗ (Powdery Mildew) ਦੀ ਰੋਕਥਾਮ ਲਈ ਘੁਲਣਸ਼ੀਲ ਗੰਧਕ 2 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਛਿੜਕੋ।'
            : 'मटर की खेती: मटर अगेता-7 व AP-3 प्रमुख किस्में हैं। प्रति एकड़ 35-40 किलो बीज डालें। चूर्णिल आसिता से बचाव के लिए घुलनशील सल्फर 2 ग्राम प्रति लीटर पानी में स्प्रे करें।';
        }
        return language === 'punjabi'
          ? `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰ ਜੀ! ਨਵੰਬਰ ਮਹੀਨੇ ਵਿੱਚ ਪੰਜਾਬ ਵਿੱਚ ਸਰਦੀਆਂ ਦੀਆਂ ਸਬਜ਼ੀਆਂ (ਜਿਵੇਂ ਗੋਭੀ, ਗਾਜਰ, ਮੂਲੀ, ਸ਼ਲਗਮ, ਪਾਲਕ, ਮਟਰ, ਮੇਥੀ, ਪਿਆਜ਼ ਅਤੇ ਲਸਣ) ਦੀ ਬਿਜਾਈ ਅਤੇ ਦੇਖਭਾਲ ਦਾ ਸਭ ਤੋਂ ਵਧੀਆ ਸਮਾਂ ਹੈ। ਚੰਗੀ ਪੈਦਾਵਾਰ ਲਈ ਪ੍ਰਤੀ ਏਕੜ 10-15 ਟਨ ਰੂੜੀ ਖਾਦ ਪਾਓ। ਤੁਪਕਾ ਸਿੰਚਾਈ (Drip) 'ਤੇ ਪੰਜਾਬ ਸਰਕਾਰ 80% ਸਬਸਿਡੀ ਦੇ ਰਹੀ ਹੈ।`
          : 'नमस्ते किसान भाई! नवंबर में सर्दियों की सब्जियों (आलू, मटर, गोभी, गाजर, मूली, पालक, लहसुन) की खेती का उत्तम समय है। 10-15 टन गोबर की खाद डालें और बीजों को कवकनाशी से उपचारित करके बोएं।';
      }

      // 2. Parali / Stubble / Straw (ONLY when explicitly asked)
      if (q.includes('ਪਰਾਲੀ') || q.includes('parali') || q.includes('stubble') || q.includes('straw') || q.includes('crm')) {
        return language === 'punjabi'
          ? `ਪਰਾਲੀ ਦੀ ਸਾਂਭ-ਸੰਭਾਲ: ਸੁਪਰ ਸੀਡਰ ਜਾਂ ਸਮਾਰਟ ਸੀਡਰ ਨਾਲ ਬਿਨਾਂ ਪਰਾਲੀ ਸਾੜੇ ਕਣਕ ਦੀ ਸਿੱਧੀ ਬਿਜਾਈ ਕਰੋ। ਇਸ ਨਾਲ ਜ਼ਮੀਨ ਦੀ ਉਪਜਾਊ ਸ਼ਕਤੀ ਵਧਦੀ ਹੈ, ਨਦੀਨ ਘੱਟ ਉੱਗਦੇ ਹਨ ਅਤੇ ਪ੍ਰਤੀ ਏਕੜ ₹2,500 ਦੀ ਬੱਚਤ ਹੁੰਦੀ ਹੈ। ਪੰਜਾਬ ਸਰਕਾਰ ਸੁਪਰ ਸੀਡਰ 'ਤੇ 50% ਤੋਂ 80% ਸਬਸਿਡੀ agrimachinerypb.com ਰਾਹੀਂ ਦੇ ਰਹੀ ਹੈ।`
          : 'पराली प्रबंधन: सुपर सीडर से बिना पराली जलाए गेहूं की सीधी बुवाई करें। इससे मिट्टी की उर्वरा शक्ति बढ़ती है और खरपतवार कम होते हैं। पंजाब सरकार सुपर सीडर पर 50-80% सब्सिडी दे रही है।';
      }

      // 3. Water / Irrigation / Sichai
      if (
        q.includes('ਪਾਣੀ') || q.includes('ਸਿੰਚਾਈ') || q.includes('पानी') || q.includes('सिंचाई') ||
        q.includes('irrigation') || q.includes('water') || q.includes('pani') || q.includes('paani') ||
        q.includes('pehla') || q.includes('sichai') || q.includes('sinchai') || q.includes('tubewell')
      ) {
        return language === 'punjabi'
          ? 'ਸਿੰਚਾਈ ਅਤੇ ਪਾਣੀ ਪ੍ਰਬੰਧਨ: PAU ਲੁਧਿਆਣਾ ਦੀ ਸਿਫ਼ਾਰਸ਼ ਅਨੁਸਾਰ ਕਣਕ ਨੂੰ ਪਹਿਲਾ ਪਾਣੀ ਬਿਜਾਈ ਤੋਂ 21-25 ਦਿਨਾਂ ਬਾਅਦ (CRI ਸਟੇਜ) ਹਲਕਾ ਲਗਾਓ। ਭਾਰੀ ਪਾਣੀ ਨਾਲ ਬੂਟੇ ਪੀਲੇ ਪੈ ਸਕਦੇ ਹਨ। ਪਾਣੀ ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ ਪ੍ਰਤੀ ਏਕੜ 1 ਬੋਰੀ ਯੂਰੀਆ ਅਤੇ 25 ਕਿਲੋ ਜ਼ਿੰਕ 21% ਪਾਓ। ਸਬਜ਼ੀਆਂ ਵਿੱਚ ਤੁਪਕਾ ਸਿੰਚਾਈ (Drip) ਨਾਲ 60% ਪਾਣੀ ਬਚਦਾ ਹੈ।'
          : 'सिंचाई एवं जल प्रबंधन: गेहूं में पहला पानी 21-25 दिन बाद हल्का लगाएं। ज्यादा पानी भरने से फसल पीली पड़ सकती है। सिंचाई के तुरंत बाद 1 बोरी यूरिया व 25 किलो जिंक डालें। सब्जियों में ड्रिप सिंचाई अपनाएं जिस पर 80% सब्सिडी मिलती है।';
      }

      // 4. Yellow Rust / Kungi
      if (q.includes('ਕੁੰਗੀ') || q.includes('rust') || q.includes('kungi') || q.includes('pili')) {
        return language === 'punjabi'
          ? 'ਪੀਲੀ ਕੁੰਗੀ (Yellow Rust) ਰੋਕਥਾਮ: ਪ੍ਰੋਪੀਕੋਨਾਜ਼ੋਲ 25% EC (ਟਿਲਟ / Tilt) 200 ਮਿਲੀਲੀਟਰ ਨੂੰ 200 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਪ੍ਰਤੀ ਏਕੜ ਸਾਫ਼ ਧੁੱਪ ਵਾਲੇ ਦਿਨ ਫਲੈਟ ਫੈਨ ਨੋਜ਼ਲ ਨਾਲ ਛਿੜਕੋ। ਜੇਕਰ ਲੋੜ ਪਵੇ ਤਾਂ 15 ਦਿਨਾਂ ਬਾਅਦ ਫੋਲੀਕਰ ਸਪਰੇਅ ਕਰੋ।'
          : 'पीला रतुआ नियंत्रण: प्रोपिकोनाजोल 25% EC (टिल्ट) 200 मिली प्रति 200 लीटर पानी में मिलाकर प्रति एकड़ धूप में स्प्रे करें। आवश्यकतानुसार 15 दिन बाद दोहराएं।';
      }

      // 5. Weeds / Gulli Danda
      if (q.includes('ਨਦੀਨ') || q.includes('ਗੁੱਲੀ') || q.includes('weed') || q.includes('gulli') || q.includes('danda')) {
        return language === 'punjabi'
          ? 'ਗੁੱਲੀ ਡੰਡੇ ਦੀ ਰੋਕਥਾਮ ਲਈ ਬਿਜਾਈ ਤੋਂ 30-35 ਦਿਨਾਂ ਬਾਅਦ (ਪਹਿਲੇ ਪਾਣੀ ਪਿੱਛੋਂ) ਕਲੋਡੀਨਾਫੋਪ 15% WP (ਟੌਪਿਕ) 160 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਏਕੜ 150 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਕੱਟ ਵਾਲੀ ਨੋਜ਼ਲ ਨਾਲ ਛਿੜਕੋ।'
          : 'गुल्ली डंडा की रोकथाम हेतु बुवाई के 30-35 दिन बाद (पहले पानी के बाद) क्लोडिनाफॉप 15% WP (टॉपिक) 160 ग्राम प्रति एकड़ 150 लीटर पानी में मिलाकर स्प्रे करें।';
      }

      // 6. Fertilizers / Rates
      if (q.includes('ਯੂਰੀਆ') || q.includes('ਖਾਦ') || q.includes('urea') || q.includes('dap')) {
        return language === 'punjabi'
          ? 'ਸਰਕਾਰੀ ਨਿਯਮਾਂ ਅਨੁਸਾਰ: ਨੀਮ ਕੋਟਿਡ ਯੂਰੀਆ (45 ਕਿਲੋ) ਦਾ ਅਸਲ ਸਰਕਾਰੀ MRP ₹266.50 ਹੈ ਅਤੇ ਡੀ.ਏ.ਪੀ. (50 ਕਿਲੋ) ਦਾ ਸਰਕਾਰੀ ਰੇਟ ₹1,350 ਹੈ। ਕੋਈ ਵੀ ਡੀਲਰ ਇਸ ਤੋਂ ਵੱਧ ਰੇਟ ਨਹੀਂ ਲੈ ਸਕਦਾ। ਵੱਧ ਰੇਟ ਲੈਣ ਤੇ ਸਾਡੇ ਐਪ ਵਿੱਚ ਸ਼ਿਕਾਇਤ ਕਰੋ।'
          : 'सरकारी दरों के अनुसार यूरिया ₹266.50 (45 किग्रा) और डीएपी ₹1,350 प्रति बैग है। अधिक वसूली पर हमारे ऐप में शिकायत दर्ज करें।';
      }

      // 7. Mandi Rates
      if (q.includes('ਮੰਡੀ') || q.includes('ਭਾਅ') || q.includes('rate') || q.includes('mandi') || q.includes('msp')) {
        return language === 'punjabi'
          ? 'ਅੱਜ ਖੰਨਾ ਅਤੇ ਪੰਜਾਬ ਮੰਡੀਆਂ ਵਿੱਚ ਕਣਕ ਦਾ ਸਰਕਾਰੀ MSP ₹2,425/ਕੁਇੰਟਲ ਹੈ। ਬਾਸਮਤੀ 1121 ਦਾ ਮੰਡੀ ਭਾਅ ₹3,850 ਤੋਂ ₹4,280 ਚੱਲ ਰਿਹਾ ਹੈ। ਨਰਮਾ ₹6,900 ਤੋਂ ₹7,450 ਅਤੇ ਸਰ੍ਹੋਂ ₹5,820 ਵਿਕ ਰਹੀ ਹੈ।'
          : 'पंजाब मंडियों में गेहूं का न्यूनतम समर्थन मूल्य ₹2,425, बासमती 1121 का भाव ₹3,850 से ₹4,280 और नरमा ₹6,900 से ₹7,450 प्रति क्विंटल है।';
      }

      // 8. Subsidies
      if (q.includes('ਸਬਸਿਡੀ') || q.includes('ਸੀਡਰ') || q.includes('subsidy') || q.includes('solar')) {
        return language === 'punjabi'
          ? `ਪੰਜਾਬ ਸਰਕਾਰ ਸੁਪਰ ਸੀਡਰ 'ਤੇ 50% ਤੋਂ 80% ਸਬਸਿਡੀ agrimachinerypb.com ਰਾਹੀਂ ਦੇ ਰਹੀ ਹੈ। PM-KUSUM ਤਹਿਤ ਸੋਲਰ ਪੰਪ 'ਤੇ 75% ਸਬਸਿਡੀ ਅਤੇ KCC 'ਤੇ ਸਿਰਫ਼ 4% ਵਿਆਜ ਦਰ ਮਿਲਦੀ ਹੈ।`
          : 'पंजाब सरकार सुपर सीडर पर 50% से 80% सब्सिडी दे रही है। agrimachinerypb.com पर आवेदन करें। पीएम कुसुम सोलर पंप पर 75% सब्सिडी उपलब्ध है।';
      }

      // 9. Dairy / Livestock
      if (q.includes('ਡੇਅਰੀ') || q.includes('ਪਸ਼ੂ') || q.includes('ਮੱਝ') || q.includes('ਗਾਂ') || q.includes('dairy') || q.includes('milk')) {
        return language === 'punjabi'
          ? 'ਡੇਅਰੀ ਅਤੇ ਪਸ਼ੂ ਪਾਲਣ (GADVASU): ਸਰਦੀਆਂ ਵਿੱਚ ਪਸ਼ੂਆਂ ਨੂੰ ਠੰਢ ਤੋਂ ਬਚਾਓ। ਮੱਕੀ ਦਾ ਸਾਈਲੇਜ ਅਤੇ ਬਰਸੀਮ ਦਿਓ। ਪ੍ਰਤੀ ਪਸ਼ੂ ਰੋਜ਼ਾਨਾ 50 ਗ੍ਰਾਮ ਖਣਿਜ ਮਿਸ਼ਰਣ (Mineral Mixture) ਅਤੇ 30 ਗ੍ਰਾਮ ਨਮਕ ਜ਼ਰੂਰ ਦਿਓ।'
          : 'डेयरी एवं पशुपालन: सर्दियों में पशुओं को ठंड से बचाएं। मक्का साइलेज संतुलित मात्रा में दें। प्रतिदिन 50 ग्राम मिनरल मिक्सचर दें और थनों की नियमित सफाई रखें।';
      }

      // 10. Wheat Sowing
      if (q.includes('ਕਣਕ') || q.includes('wheat') || q.includes('gehu') || q.includes('ਬਿਜਾਈ') || q.includes('sowing')) {
        return language === 'punjabi'
          ? 'ਕਣਕ ਦੀ ਖੇਤੀ (Rabi 2026): ਨਵੰਬਰ ਦਾ ਪਹਿਲਾ ਪੰਦਰਵਾੜਾ ਕਣਕ ਦੀ ਬਿਜਾਈ ਲਈ ਸਭ ਤੋਂ ਉੱਤਮ ਹੈ। PAU ਵੱਲੋਂ ਪ੍ਰਮਾਣਿਤ ਕਿਸਮਾਂ PBW 826, PBW 803, ਅਤੇ HD 3086 ਬੀਜੋ। ਬੀਜ ਦੀ ਮਾਤਰਾ 40 ਕਿੱਲੋ ਪ੍ਰਤੀ ਏਕੜ ਰੱਖੋ। ਸੁਪਰ ਸੀਡਰ ਨਾਲ ਬਿਜਾਈ ਸਮੇਂ 1 ਬੋਰੀ DAP ਡ੍ਰਿਲ ਕਰੋ। ਪਹਿਲਾ ਪਾਣੀ 21-25 ਦਿਨਾਂ ਬਾਅਦ ਹੀ ਲਗਾਓ।'
          : 'गेहूं की बुवाई (रबी 2026): नवंबर का पहला पखवाड़ा गेहूं के लिए सर्वश्रेष्ठ है। पीबीडब्ल्यू 826 और एचडी 3086 जैसी प्रमाणित किस्में 40 किग्रा/एकड़ की दर से बोएं। बुवाई के समय 1 बोरी डीएपी ड्रिल करें और पहला पानी 21-25 दिन बाद दें।';
      }

      // 11. General Crops & Farming
      if (
        q.includes('ਫਸਲ') || q.includes('ਫਸਲਾਂ') || q.includes('ਖੇਤੀ') ||
        q.includes('फसल') || q.includes('फसलों') || q.includes('खेती') ||
        q.includes('fasal') || q.includes('faslo') || q.includes('faslan') || q.includes('kheti') ||
        q.includes('crops') || q.includes('crop')
      ) {
        return language === 'punjabi'
          ? 'ਪੰਜਾਬ ਵਿੱਚ ਹਾੜ੍ਹੀ (Rabi 2026) ਦੀਆਂ ਮੁੱਖ ਫਸਲਾਂ: ਕਣਕ (PBW 826), ਸਰ੍ਹੋਂ/ਰਾਇਆ (RLC 3), ਛੋਲੇ, ਜਵੀਂ ਅਤੇ ਬਰਸੀਮ ਚਾਰਾ ਹਨ। ਬਿਜਾਈ ਤੋਂ ਪਹਿਲਾਂ ਬੀਜ ਦੀ ਸੋਧ ਜ਼ਰੂਰ ਕਰੋ। ਜ਼ਮੀਨ ਵਿੱਚ ਨਮੀ ਅਨੁਸਾਰ ਹੀ ਬਿਜਾਈ ਕਰੋ ਅਤੇ ਸੁਪਰ ਸੀਡਰ ਜਾਂ ਜ਼ੀਰੋ ਟਿਲ ਡ੍ਰਿਲ ਨਾਲ ਖਾਦ-ਬੀਜ ਇਕੱਠੇ ਕੇਰੋ। ਕਿਸੇ ਵੀ ਫਸਲ ਬਾਰੇ ਵਿਸ਼ੇਸ਼ ਜਾਣਕਾਰੀ ਲਈ ਉਸਦਾ ਨਾਮ ਲਿਖ ਕੇ ਪੁੱਛੋ।'
          : 'रबी सीजन 2026 की प्रमुख फसलें: गेहूं, सरसों/राया, चना, मटर और हरा चारा (बरसीम/जई) हैं। बुवाई से पहले बीजोपचार अवश्य करें और संतुलित मात्रा में डीएपी व पोटाश डालें। किसी भी विशिष्ट फसल की जानकारी के लिए उसका नाम लिखकर पूछें।';
      }

      // Default
      return language === 'punjabi'
        ? `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰ ਜੀ! ਮੈਂ ਡਿਜੀਟਲ ਕਿਸਾਨ ਸਾਥੀ ਏ.ਆਈ. ਹਾਂ। ਤੁਹਾਡੇ ਸਵਾਲ ("${qText}") ਲਈ PAU ਲੁਧਿਆਣਾ ਦੀ ਸਿਫ਼ਾਰਸ਼ ਹੈ ਕਿ ਨਵੰਬਰ 2026 ਦੇ ਹਾੜ੍ਹੀ ਸੀਜ਼ਨ ਵਿੱਚ ਫਸਲਾਂ ਅਤੇ ਸਬਜ਼ੀਆਂ ਵਿੱਚ ਸਮੇਂ ਸਿਰ ਸੰਤੁਲਿਤ ਖਾਦਾਂ ਅਤੇ ਪਾਣੀ ਦੀ ਵਰਤੋਂ ਕਰੋ। ਬਿਮਾਰੀ ਦੇ ਸ਼ੱਕ ਵੇਲੇ ਫਸਲ ਡਾਕਟਰ ਰਾਹੀਂ ਫੋਟੋ ਖਿੱਚ ਕੇ ਜਾਂਚ ਕਰੋ, ਜਾਂ ਮੁਫ਼ਤ ਸਲਾਹ ਲਈ ਕਿਸਾਨ ਕਾਲ ਸੈਂਟਰ 1800-180-1551 ਉੱਤੇ ਕਾਲ ਕਰੋ।`
        : `नमस्ते किसान भाई! मैं डिजिटल किसान साथी ए.आई. हूँ। आपके प्रश्न ("${qText}") हेतु कृषि वैज्ञानिकों की सलाह है कि रबी 2026 में संतुलित खाद व समय पर सिंचाई करें। अधिक जानकारी हेतु किसान कॉल सेंटर 1800-180-1551 पर कॉल करें।`;
    };

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text || newMsg.content,
          imageBase64: imageToAttach || undefined,
          videoFrameBase64: isVideoFrameAttached ? imageToAttach || undefined : undefined,
          language,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      let replyText = '';
      if (response.ok) {
        const data = await response.json();
        replyText = data.reply;
      }

      if (!replyText || replyText.trim().length === 0) {
        replyText = getLocalAgriAdvice(text);
      }

      const aiMsgId = `ai-${Date.now()}`;
      const aiMsg: Message = {
        id: aiMsgId,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);

      playChimeTone();
      if (voiceEnabled) {
        speakText(replyText, aiMsgId);
      }
    } catch (err) {
      console.warn('Network or assistant fetch issue:', err);
      const fallbackReply = getLocalAgriAdvice(text);
      const aiMsgId = `ai-${Date.now()}`;

      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          role: 'assistant',
          content: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      playChimeTone();
      if (voiceEnabled) {
        speakText(fallbackReply, aiMsgId);
      }
    } finally {
      setIsLoading(false);
    }
  };

  handleSendMessageRef.current = handleSendMessage;

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const quickQuestions =
    language === 'punjabi'
      ? [
          'ਇਹ ਐਪ ਕਿਸਨੇ ਬਣਾਈ ਹੈ? (ਸੰਸਥਾਪਕ: ਜੱਸ ਬਸਰਾਨ / Jass Basran)',
          'ਸਰਦੀਆਂ ਦੀਆਂ ਸਬਜ਼ੀਆਂ (ਆਲੂ, ਮਟਰ, ਗੋਭੀ) ਦੀ ਕਾਸ਼ਤ ਕਿਵੇਂ ਕਰੀਏ?',
          'ਕਣਕ ਨੂੰ ਪਹਿਲਾ ਪਾਣੀ ਕਦੋਂ ਲਾਈਏ ਅਤੇ ਕਿੰਨੀ ਯੂਰੀਆ ਪਾਈਏ?',
          'ਟਮਾਟਰ ਵਿੱਚ ਕੀੜੇ ਅਤੇ ਪੱਤਾ ਮਰੋੜ ਰੋਗ ਦੀ ਸਪਰੇਅ ਕਿਹੜੀ ਹੈ?',
          'ਪੀਲੀ ਕੁੰਗੀ (Yellow Rust) ਦੇ ਲੱਛਣ ਅਤੇ ਸਪਰੇਅ ਕਿਹੜੀ ਹੈ?',
          'ਸੁਪਰ ਸੀਡਰ 50% ਸਬਸਿਡੀ ਲਈ ਕਿਹੜੇ ਕਾਗਜ਼ ਚਾਹੀਦੇ ਹਨ?',
          'ਕਣਕ ਵਿੱਚ ਗੁੱਲੀ ਡੰਡੇ ਦੀ ਰੋਕਥਾਮ ਲਈ ਦਵਾਈ ਕਿਹੜੀ ਹੈ?',
        ]
      : language === 'hindi'
      ? [
          'यह ऐप किसने बनाई है? (संस्थापक: जस्स बसरान / Jass Basran)',
          'सर्दियों की सब्जियों (आलू, मटर, गोभी) की खेती की सलाह',
          'गेहूं में पहला पानी कब लगाएं और कितनी यूरिया डालें?',
          'टमाटर में सुंडी व पत्ता मरोड़ रोग की रोकथाम क्या है?',
          'पीला रतुआ (Yellow Rust) के लक्षण और अनुशंसित स्प्रे क्या है?',
          'सुपर सीडर सब्सिडी के लिए कौन-कौन से दस्तावेज चाहिए?',
          'गेहूं में गुल्ली डंडा (खरपतवार) की रोकथाम कैसे करें?',
        ]
      : [
          'Who created Digital Kisan Sathi? (Founder Jass Basran)',
          'Winter vegetables cultivation guide (Potato, Peas, Cauliflower)?',
          'When should 1st irrigation be applied to wheat and how much urea?',
          'How to treat fruit borer and leaf curl virus in tomatoes?',
          'What are the symptoms and best spray for Yellow Rust?',
          'What documents are needed for Punjab Super Seeder subsidy?',
          'How to control Phalaris minor (Gulli Danda) weed in wheat?',
        ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-[#F7F7E9] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#14532D]/20 flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#14532D] text-white px-5 py-4 flex items-center justify-between border-b border-[#EABF48]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#EABF48] to-[#fce588] text-[#14532D] flex items-center justify-center shadow-md">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-white">
                  {t.voiceAssistantTitle}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EABF48] text-[#14532D]">
                  PAU Ludhiana Smart AI
                </span>
              </div>
              <p className="text-xs text-[#EDEDD6]">
                {language === 'punjabi'
                  ? 'ਬੋਲ ਕੇ ਜਾਂ ਲਿਖ ਕੇ ਪੁੱਛੋ (ਪੰਜਾਬੀ / हिंदी / English)'
                  : 'Speak or type your farming questions naturally'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto-Send Toggle Button */}
            <button
              type="button"
              onClick={() => setAutoSend(!autoSend)}
              title={autoSend ? 'ਆਟੋ-ਸੈਂਡ ਬੰਦ ਕਰੋ' : 'ਆਟੋ-ਸੈਂਡ ਚਾਲੂ ਕਰੋ'}
              className={`px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border ${
                autoSend
                  ? 'bg-[#EABF48] text-[#14532D] border-[#EABF48] shadow-sm'
                  : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${autoSend ? 'fill-[#14532D]' : ''}`} />
              <span className="hidden sm:inline">
                {language === 'punjabi'
                  ? autoSend ? 'ਆਟੋ-ਸੈਂਡ: ਚਾਲੂ' : 'ਆਟੋ-ਸੈਂਡ: ਬੰਦ'
                  : language === 'hindi'
                  ? autoSend ? 'ऑटो-सेंड: चालू' : 'ऑटो-सेंड: बंद'
                  : autoSend ? 'Auto-Send: ON' : 'Auto-Send: OFF'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleTestSpeaker}
              title="ਟੈਸਟ ਆਵਾਜ਼ ਚਲਾਓ (Test Voice)"
              className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-[#EABF48] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-[#EABF48]/40"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">ਟੈਸਟ ਆਵਾਜ਼</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setVoiceEnabled(!voiceEnabled);
                if (voiceEnabled) window.speechSynthesis?.cancel();
              }}
              title={voiceEnabled ? 'Mute AI voice' : 'Enable AI voice'}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                voiceEnabled ? 'bg-[#EABF48] text-[#14532D]' : 'bg-white/10 text-white/60'
              }`}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs: Voice vs Live Video */}
        <div className="bg-[#0f3d21] px-4 py-2 border-b border-[#EABF48]/20 flex items-center justify-between">
          <div className="flex items-center gap-1.5 p-1 bg-black/20 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => toggleVideoMode(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'voice'
                  ? 'bg-[#EABF48] text-[#14532D] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{language === 'punjabi' ? 'ਆਵਾਜ਼ ਮੋਡ (Voice)' : language === 'hindi' ? 'वॉयस मोड' : 'Voice Mode'}</span>
            </button>

            <button
              type="button"
              onClick={() => toggleVideoMode(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'video'
                  ? 'bg-red-600 text-white shadow-sm ring-2 ring-red-300'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'punjabi' ? '📹 ਲਾਈਵ ਵੀਡੀਓ (Live Video)' : language === 'hindi' ? '📹 लाइव वीडियो' : '📹 Live Video'}</span>
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#EDEDD6]/90 font-semibold hidden sm:flex">
            <Sparkles className="w-3.5 h-3.5 text-[#EABF48]" />
            <span>Gemini 3.8 Live Crop Vision</span>
          </div>
        </div>

        {/* Live Video Camera Viewport when activeMode === 'video' */}
        {activeMode === 'video' && (
          <div className="relative bg-black border-b border-[#14532D]/30 overflow-hidden">
            <div className="relative aspect-video max-h-60 sm:max-h-72 w-full mx-auto bg-black flex items-center justify-center">
              {/* Hidden canvas for taking snapshot */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Live Video Feed */}
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder crosshairs and scanning laser overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-4">
                <div className="relative w-48 sm:w-64 h-32 sm:h-40 border-2 border-dashed border-[#EABF48]/80 rounded-2xl flex items-center justify-center shadow-lg">
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#EABF48]"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#EABF48]"></div>
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#EABF48]"></div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#EABF48]"></div>

                  {/* Scanning Laser Bar */}
                  <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_#10B981] animate-pulse"></div>

                  <div className="text-center px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-[10px] text-white/90 font-medium">
                    {language === 'punjabi' ? 'ਫਸਲ / ਪੱਤੇ ਇੱਥੇ ਦਿਖਾਓ' : 'फसल / पत्तियां यहां दिखाएं'}
                  </div>
                </div>
              </div>

              {/* Top Video Overlay Controls */}
              <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span className="text-red-400">● LIVE CROP CAMERA</span>
                  <span className="text-white/40">|</span>
                  <span className="text-emerald-300">PAU Vision</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={switchCamera}
                    title="ਫਲਿੱਪ ਕੈਮਰਾ (Switch Camera)"
                    className="px-2 py-1 rounded-xl bg-black/60 hover:bg-black/80 text-white text-xs font-bold flex items-center gap-1 border border-white/20 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#EABF48]" />
                    <span className="text-[10px]">
                      {facingMode === 'environment' ? 'ਪਿਛਲਾ ਕੈਮਰਾ' : 'ਅਗਲਾ ਕੈਮਰਾ'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleVideoMode(false)}
                    title="ਵੀਡੀਓ ਬੰਦ ਕਰੋ (Close Video)"
                    className="p-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-white/80 hover:text-white border border-white/20 transition-all cursor-pointer"
                  >
                    <VideoOff className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Camera Error Alert */}
              {cameraError && (
                <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-4 text-center z-10">
                  <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
                  <p className="text-xs text-white max-w-xs">{cameraError}</p>
                  <button
                    type="button"
                    onClick={() => startCamera(facingMode)}
                    className="mt-3 px-3 py-1.5 rounded-xl bg-[#EABF48] text-[#14532D] text-xs font-bold cursor-pointer"
                  >
                    ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ (Retry)
                  </button>
                </div>
              )}

              {/* Bottom Video Floating Action Bar */}
              <div className="absolute bottom-2 inset-x-2 flex items-center justify-between gap-2 pointer-events-auto">
                <div className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] flex items-center gap-2 border border-white/15">
                  <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-emerald-400 animate-ping' : 'bg-gray-400'}`}></div>
                  <span className="text-white font-medium truncate max-w-[140px] sm:max-w-[210px]">
                    {isListening
                      ? (inputQuery || (language === 'punjabi' ? 'ਸੁਣ ਰਿਹਾ ਹੈ • ਬੋਲੋ...' : 'सुन रहा है • बोलिए...'))
                      : (language === 'punjabi' ? 'ਬੋਲੋ ਜਾਂ ਸਕੈਨ ਬਟਨ ਦਬਾਓ' : 'बोलें या स्कैन बटन दबाएं')}
                  </span>
                </div>

                {/* Instant Scan & Diagnose Button */}
                <button
                  type="button"
                  onClick={() => {
                    handleSendMessage(
                      inputQuery ||
                        (language === 'punjabi'
                          ? 'ਕਿਰਪਾ ਕਰਕੇ ਇਸ ਵੀਡੀਓ ਵਿੱਚ ਦਿਖ ਰਹੀ ਫਸਲ, ਇਸਦੇ ਪੱਤਿਆਂ ਦੀ ਬਿਮਾਰੀ ਜਾਂ ਕੀੜੇ ਦੀ ਜਾਂਚ ਕਰੋ ਅਤੇ PAU ਸਿਫ਼ਾਰਸ਼ਾਂ ਅਨੁਸਾਰ ਤੁਰੰਤ ਇਲਾਜ ਦੱਸੋ।'
                          : 'कृपया इस वीडियो में दिख रही फसल की बीमारी की जांच करें और PAU अनुसार उपचार बताएं।')
                    );
                  }}
                  disabled={isLoading}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#EABF48] via-[#f7d87a] to-[#EABF48] text-[#14532D] font-bold text-xs flex items-center gap-1.5 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer glow-golden"
                >
                  <Scan className="w-3.5 h-3.5" />
                  <span>
                    {language === 'punjabi'
                      ? '⚡ ਫਸਲ ਸਕੈਨ ਕਰੋ & ਪੁੱਛੋ'
                      : language === 'hindi'
                      ? '⚡ फसल स्कैन करें & पूछें'
                      : '⚡ Scan Crop & Ask AI'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Auto-Sending Indicator */}
        {isAutoSending && (
          <div className="bg-emerald-600 text-white border-b border-emerald-700 px-4 py-2.5 flex items-center justify-between text-xs font-bold animate-pulse">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#EABF48]" />
              <span>
                {language === 'punjabi'
                  ? 'ਬੋਲਣਾ ਪੂਰਾ ਹੋਇਆ! ਸਵਾਲ ਆਪਣੇ ਆਪ ਭੇਜਿਆ ਜਾ ਰਿਹਾ ਹੈ...'
                  : language === 'hindi'
                  ? 'बोलना पूरा हुआ! सवाल अपने आप भेजा जा रहा है...'
                  : 'Finished speaking! Question auto-sending now...'}
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white">
              ⚡ Hands-Free Auto-Send
            </span>
          </div>
        )}

        {/* Audio Waveform indicator when listening */}
        {isListening && !isAutoSending && (
          <div className="bg-[#EABF48]/25 border-b border-[#EABF48]/40 px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-[#14532D]">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-3.5 bg-[#14532D] rounded-full animate-bounce"></span>
                <span className="w-1.5 h-5 bg-[#4D9B55] rounded-full animate-bounce [animation-delay:0.1s]"></span>
                <span className="w-1.5 h-7 bg-[#EABF48] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-4.5 bg-[#4D9B55] rounded-full animate-bounce [animation-delay:0.3s]"></span>
                <span className="w-1.5 h-3 bg-[#14532D] rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span className="font-bold">
                {language === 'punjabi'
                  ? 'ਮਾਈਕ ਸੁਣ ਰਿਹਾ ਹੈ • ਬੋਲੋ ਜੀ (ਬੋਲ ਕੇ ਚੁੱਪ ਹੁੰਦੇ ਹੀ ਆਪਣੇ ਆਪ ਭੇਜਿਆ ਜਾਵੇਗਾ)'
                  : language === 'hindi'
                  ? 'माइक सुन रहा है • बोलिए (बोलकर रुकते ही अपने आप सेंड हो जाएगा)'
                  : 'Listening • Speak naturally (Auto-sends 1.4s after you stop)'}
              </span>
            </div>
            <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#14532D] text-[#EABF48] font-bold">
              ⚡ Auto-Send
            </span>
          </div>
        )}

        {/* Messages Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => {
            const isAI = msg.role === 'assistant';
            const isSpeakingThis = activeSpeakingId === msg.id;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {isAI && (
                  <div className="w-8 h-8 rounded-full bg-[#14532D] text-[#EABF48] flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3.5 sm:p-4 text-sm leading-relaxed shadow-sm ${
                    isAI
                      ? 'bg-white text-[#1E293B] border border-[#14532D]/10'
                      : 'bg-[#14532D] text-white'
                  }`}
                >
                  {msg.imageUrl && (
                    <div className="mb-2.5 rounded-xl overflow-hidden border border-white/20 max-h-52 relative group shadow-sm">
                      <img src={msg.imageUrl} alt="Crop inspection" className="w-full h-full object-cover" />
                      {msg.isVideoFrame && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-sm text-[10px] font-bold text-[#EABF48] flex items-center gap-1 border border-white/20">
                          <Video className="w-3 h-3 text-red-400" />
                          <span>{language === 'punjabi' ? 'ਲਾਈਵ ਵੀਡੀਓ ਫਰੇਮ' : language === 'hindi' ? 'लाइव वीडियो फ्रेम' : 'Live Video Frame'}</span>
                        </span>
                      )}
                    </div>
                  )}

                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  <div
                    className={`mt-2 flex items-center justify-between text-[11px] ${
                      isAI ? 'text-gray-400' : 'text-emerald-200'
                    }`}
                  >
                    <span>{msg.timestamp}</span>

                    {isAI && (
                      <button
                        type="button"
                        onClick={() => speakText(msg.content, msg.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl transition-all font-bold cursor-pointer shadow-sm ${
                          isSpeakingThis
                            ? 'bg-emerald-600 text-white animate-pulse ring-2 ring-emerald-300'
                            : 'bg-[#EABF48] hover:bg-[#d4a732] text-[#14532D]'
                        }`}
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>{isSpeakingThis ? 'ਰੋਕੋ (Speaking...)' : '🔊 ਆਵਾਜ਼ ਸੁਣੋ (Play Voice)'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {!isAI && (
                  <div className="w-8 h-8 rounded-full bg-[#EABF48] text-[#14532D] flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-[#14532D] text-[#EABF48] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-[#14532D]/10 flex items-center gap-2 text-xs text-gray-500">
                <div className="w-2 h-2 rounded-full bg-[#4D9B55] animate-ping"></div>
                <span>PAU ਖੇਤੀਬਾੜੀ ਮਾਹਿਰ ਜਵਾਬ ਤਿਆਰ ਕਰ ਰਹੇ ਹਨ...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-white/70 border-t border-[#14532D]/10 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q)}
              className="text-xs bg-[#F7F7E9] hover:bg-[#EABF48]/20 hover:border-[#EABF48] border border-gray-200 text-[#14532D] px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer"
            >
              💡 {q}
            </button>
          ))}
        </div>

        {/* Image Attachment Preview */}
        {selectedImage && (
          <div className="px-4 py-2 bg-amber-50 border-t border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={selectedImage} alt="Crop thumbnail" className="w-10 h-10 rounded-lg object-cover border" />
              <span className="text-xs text-[#14532D] font-medium">ਫੋਟੋ ਨਾਲ ਜੋੜੀ ਗਈ ਹੈ (Crop Image Attached)</span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="text-red-600 hover:text-red-700 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#14532D]/15">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImagePick}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Attach crop image"
              className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#14532D] transition-colors cursor-pointer"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Live Video Camera Toggle Button */}
            <button
              type="button"
              onClick={() => toggleVideoMode()}
              title={activeMode === 'video' ? 'ਵੀਡੀਓ ਕੈਮਰਾ ਬੰਦ ਕਰੋ' : 'ਲਾਈਵ ਵੀਡੀਓ ਕੈਮਰਾ ਚਾਲੂ ਕਰੋ'}
              className={`p-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                activeMode === 'video'
                  ? 'bg-red-600 text-white shadow-md ring-2 ring-red-300'
                  : 'bg-emerald-100 hover:bg-emerald-200 text-[#14532D]'
              }`}
            >
              {activeMode === 'video' ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5 text-emerald-800" />}
            </button>

            {/* Microphone Button with pulsating glow when listening */}
            <button
              type="button"
              onClick={toggleListening}
              title={isListening ? 'Stop listening' : 'Speak your question'}
              className={`p-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30 ring-4 ring-red-200'
                  : 'bg-[#14532D] text-[#EABF48] hover:bg-[#0a2f18]'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                language === 'punjabi'
                  ? 'ਸਵਾਲ ਲਿਖੋ ਜਾਂ ਮਾਈਕ ਦਬਾ ਕੇ ਬੋਲੋ...'
                  : language === 'hindi'
                  ? 'प्रश्न लिखें या माइक दबाकर बोलें...'
                  : 'Type question or tap mic to speak...'
              }
              className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#4D9B55] focus:bg-white"
            />

            <button
              type="submit"
              disabled={isLoading || (!inputQuery.trim() && !selectedImage)}
              className="p-2.5 rounded-xl bg-gradient-to-r from-[#4D9B55] to-[#14532D] text-white disabled:opacity-40 hover:opacity-95 transition-opacity cursor-pointer shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-1 text-[11px] text-gray-500 px-1">
            <div className="flex items-center gap-1.5">
              <span className={`inline-block w-2 h-2 rounded-full ${autoSend ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
              <span className={autoSend ? 'text-[#14532D] font-bold' : 'text-gray-500'}>
                {autoSend
                  ? (language === 'punjabi'
                    ? '⚡ ਆਟੋ-ਸੈਂਡ: ਬੋਲ ਕੇ ਚੁੱਪ ਹੁੰਦੇ ਹੀ ਸਵਾਲ ਆਪਣੇ ਆਪ ਭੇਜਿਆ ਜਾਵੇਗਾ'
                    : language === 'hindi'
                    ? '⚡ ऑटो-सेंड: बोलकर रुकते ही सवाल अपने आप भेजा जाएगा'
                    : '⚡ Auto-Send: Question sends automatically 1.4s after speaking')
                  : (language === 'punjabi' ? 'ਮੈਨੁਅਲ ਸੈਂਡ ਚਾਲੂ ਹੈ' : 'मैनुअल सेंड चालू है')}
              </span>
            </div>
            <span className="text-gray-400">ਕਿਸਾਨ ਕਾਲ ਸੈਂਟਰ: 1800-180-1551</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
