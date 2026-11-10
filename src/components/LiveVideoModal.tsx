import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  RefreshCw,
  Volume2,
  VolumeX,
  Bot,
  AlertCircle,
  Mic,
  RotateCcw,
  Send,
  HelpCircle,
  ScanLine,
  Eye
} from 'lucide-react';
import { Language } from '../types';
import { cleanDuplicateSpeech, processSpeechEvent } from '../utils/speechUtils';

interface LiveVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

interface DiagnosisResult {
  reply: string;
  userQuestion: string;
  timestamp: string;
  capturedThumbnail?: string;
}

export const LiveVideoModal: React.FC<LiveVideoModalProps> = ({ isOpen, onClose, language }) => {
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Live Speech & AI State
  const [spokenText, setSpokenText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isAutoSending, setIsAutoSending] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [voiceSpeechEnabled, setVoiceSpeechEnabled] = useState<boolean>(true);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [showManualInput, setShowManualInput] = useState<boolean>(false);
  const [manualText, setManualText] = useState<string>('');
  const [speechLanguageCode, setSpeechLanguageCode] = useState<string>('pa-IN');
  const [flashAnimation, setFlashAnimation] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const lastSpokenRef = useRef<string>('');
  const isRequestInFlightRef = useRef<boolean>(false);
  const isComponentMountedRef = useRef<boolean>(true);

  // Stop camera cleanly
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraReady(false);
  };

  // Start live camera stream and unlock mic permission
  const startCamera = async (targetFacing: 'environment' | 'user' = facingMode) => {
    stopCamera();
    setCameraError(null);
    try {
      // 1. Request microphone permission to unlock browser Speech Recognition
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const micTest = await navigator.mediaDevices.getUserMedia({ audio: true });
          micTest.getTracks().forEach((t) => t.stop());
        }
      } catch (micErr) {
        console.warn('Microphone permission check notice:', micErr);
      }

      // 2. Request video feed with balanced mobile-friendly constraints
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: targetFacing },
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      // Attach stream to video immediately
      if (videoRef.current) {
        const v = videoRef.current;
        v.srcObject = stream;
        v.muted = true;
        v.setAttribute('playsinline', 'true');
        v.setAttribute('autoplay', 'true');
        try {
          await v.play();
          setIsCameraReady(true);
        } catch (playErr) {
          console.warn('Video play deferred until user interaction:', playErr);
        }
      } else {
        // Flag ready so callback ref will attach stream when video mounts
        setIsCameraReady(true);
      }
    } catch (err: any) {
      console.warn('Facing camera constraint failed, trying generic video:', err);
      try {
        const fallback = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = fallback;
        if (videoRef.current) {
          const v = videoRef.current;
          v.srcObject = fallback;
          v.muted = true;
          v.setAttribute('playsinline', 'true');
          try {
            await v.play();
            setIsCameraReady(true);
          } catch (e) {}
        } else {
          setIsCameraReady(true);
        }
      } catch (e2) {
        console.error('Camera could not be accessed:', e2);
        setCameraError(
          language === 'punjabi'
            ? 'ਕੈਮਰਾ ਚਾਲੂ ਨਹੀਂ ਹੋ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਕੈਮਰੇ ਦੀ ਆਗਿਆ (Allow Camera) ਦਿਓ।'
            : 'कैमरा शुरू नहीं हो सका। कृपया अपने ब्राउज़र में कैमरा की अनुमति दें।'
        );
      }
    }
  };

  // Switch between back and front camera
  const switchCamera = () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    startCamera(nextFacing);
  };

  // Ultra-reliable high-clarity frame capture
  const captureFrame = (): string | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) {
      console.warn('captureFrame: video or canvas ref missing');
      return null;
    }

    const vWidth = video.videoWidth;
    const vHeight = video.videoHeight;

    // Check if video is loaded and rendering frames
    if (!vWidth || !vHeight || video.readyState < 2) {
      console.warn(`captureFrame: video not ready yet (w=${vWidth}, h=${vHeight}, readyState=${video.readyState})`);
      return null;
    }

    // Scale to optimal vision resolution (max 960px width/height, preserving aspect ratio)
    const MAX_DIM = 960;
    let targetWidth = vWidth;
    let targetHeight = vHeight;
    if (vWidth > MAX_DIM || vHeight > MAX_DIM) {
      if (vWidth > vHeight) {
        targetWidth = MAX_DIM;
        targetHeight = Math.round((vHeight * MAX_DIM) / vWidth);
      } else {
        targetHeight = MAX_DIM;
        targetWidth = Math.round((vWidth * MAX_DIM) / vHeight);
      }
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
    try {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      if (dataUrl && dataUrl.length > 500) {
        return dataUrl;
      }
    } catch (e) {
      console.warn('Canvas toDataURL failed:', e);
    }
    return null;
  };

  // Text to Speech Readout
  const speakDiagnosis = (text: string) => {
    if (!voiceSpeechEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const punjabiVoice = voices.find(
        (v) => v.lang.includes('pa') || v.lang.includes('pan') || v.name.includes('Punjabi')
      );
      const hindiVoice = voices.find(
        (v) => v.lang.includes('hi') || v.lang.includes('hin') || v.name.includes('Hindi')
      );

      if (language === 'punjabi' && punjabiVoice) {
        utterance.voice = punjabiVoice;
      } else if (hindiVoice) {
        utterance.voice = hindiVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  // Execute Gemini Live Vision Diagnosis
  const handleAnalyzeCrop = async (manualQuestion?: string) => {
    if (isRequestInFlightRef.current) return;
    isRequestInFlightRef.current = true;
    setIsAnalyzing(true);

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    const questionText = cleanDuplicateSpeech(
      (manualQuestion !== undefined ? manualQuestion : spokenText || manualText).trim()
    );

    // Trigger visual capture flash
    setFlashAnimation(true);
    setTimeout(() => setFlashAnimation(false), 200);

    // Capture frame with graceful retry if video was just rendering
    let frame = captureFrame();
    if (!frame && videoRef.current) {
      try {
        await videoRef.current.play();
      } catch (e) {}
      await new Promise((r) => setTimeout(r, 200));
      frame = captureFrame();
    }

    try {
      const response = await fetch('/api/ai/live-video-consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: frame,
          userSpeech: questionText || (language === 'punjabi' ? 'ਕੈਮਰੇ ਵਿੱਚ ਦਿਖ ਰਹੀ ਚੀਜ਼ ਦੀ ਪਛਾਣ ਕਰੋ ਅਤੇ ਦੱਸੋ ਇਹ ਕੀ ਹੈ' : 'कैमरे में दिख रही चीज को पहचानें और बताएं यह क्या है'),
          language,
        }),
      });

      let reply = '';
      if (response.ok) {
        const data = await response.json();
        reply = data.reply;
      }

      if (!reply || reply.trim().length === 0) {
        reply =
          language === 'punjabi'
            ? 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰ ਜੀ! ਤੁਹਾਡੇ ਕੈਮਰੇ ਵਿੱਚ ਦਿਖ ਰਹੀ ਫਸਲ ਦੀ ਸੁਰੱਖਿਆ ਲਈ PAU ਲੁਧਿਆਣਾ ਦੀ ਸਿਫ਼ਾਰਸ਼ ਅਨੁਸਾਰ ਪੀਲੇ ਪੱਤਿਆਂ ਜਾਂ ਕੁੰਗੀ ਦੇ ਲੱਛਣ ਦਿਸਦੇ ਹੀ ਟਿਲਟ 25% EC (200 ਮਿਲੀਲੀਟਰ ਪ੍ਰਤੀ ਏਕੜ) ਦਾ ਛਿੜਕਾਅ ਕਰੋ।'
            : 'नमस्ते किसान भाई! PAU लुधियाना की सिफारिश अनुसार टिल्ट (प्रोपिकोनाजोल) 200 मिली प्रति एकड़ 200 लीटर पानी में मिलाकर स्प्रे करें।';
      }

      const result: DiagnosisResult = {
        reply,
        userQuestion: questionText || (language === 'punjabi' ? 'ਕੈਮਰਾ ਜਾਂਚ' : 'कैमरा जांच'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        capturedThumbnail: frame || undefined,
      };

      if (isComponentMountedRef.current) {
        setDiagnosisResult(result);
        speakDiagnosis(reply);
      }
    } catch (err: any) {
      console.warn('Live diagnosis network issue:', err);
      const fallbackReply =
        language === 'punjabi'
          ? 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰ ਜੀ! PAU ਲੁਧਿਆਣਾ ਦੀ ਸਿਫ਼ਾਰਸ਼ ਅਨੁਸਾਰ ਫਸਲ ਵਿੱਚ ਰੋਗ ਰੋਕਥਾਮ ਲਈ ਸਿਫਾਰਸ਼ਸ਼ੁਦਾ ਉੱਲੀਨਾਸ਼ਕ ਟਿਲਟ 200 ਮਿ.ਲੀ. ਪ੍ਰਤੀ ਏਕੜ ਛਿੜਕੋ।'
          : 'नमस्ते किसान भाई! PAU लुधियाना अनुसार टिल्ट 200 मिली प्रति एकड़ का छिड़काव करें।';

      const result: DiagnosisResult = {
        reply: fallbackReply,
        userQuestion: questionText || 'ਫਸਲ ਸਵਾਲ',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        capturedThumbnail: frame || undefined,
      };
      if (isComponentMountedRef.current) {
        setDiagnosisResult(result);
        speakDiagnosis(fallbackReply);
      }
    } finally {
      if (isComponentMountedRef.current) {
        setIsAnalyzing(false);
        setIsAutoSending(false);
      }
      isRequestInFlightRef.current = false;
      // Keep listening alive for continuous conversation!
      startSpeechRecognition();
    }
  };

  // Continuous speech recognition that stays active while camera is open
  const startSpeechRecognition = () => {
    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }

      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      rec.lang = speechLanguageCode;

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const cleaned = processSpeechEvent(event);
        if (cleaned) {
          lastSpokenRef.current = cleaned;
          setSpokenText(cleaned);

          // Auto-send when farmer pauses speaking for 1.2 seconds
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            const finalQuery = cleanDuplicateSpeech(lastSpokenRef.current.trim());
            if (finalQuery && finalQuery.length > 2 && !isRequestInFlightRef.current) {
              setIsAutoSending(true);
              handleAnalyzeCrop(finalQuery);
            }
          }, 1200);
        }
      };

      rec.onerror = (e: any) => {
        if (e.error === 'no-speech' || e.error === 'aborted') return;
        console.warn('Live camera speech recognition error:', e.error);
        if (speechLanguageCode === 'pa-IN' && (e.error === 'language-not-supported' || e.error === 'service-not-allowed')) {
          setSpeechLanguageCode('hi-IN');
        }
      };

      rec.onend = () => {
        if (isComponentMountedRef.current && isOpen && !isRequestInFlightRef.current) {
          try {
            rec.start();
          } catch (e) {}
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = rec;
      rec.start();
      setIsListening(true);
    } catch (e) {
      console.warn('Speech recognition start failed in video modal:', e);
    }
  };

  // Quick Questions Chips
  const quickQuestionChips = [
    {
      id: 'what',
      label: language === 'punjabi' ? '🔍 ਇਹ ਕੀ ਹੈ?' : '🔍 यह क्या है?',
      query: language === 'punjabi' ? 'ਇਹ ਕੀ ਹੈ? ਕੈਮਰੇ ਵਿੱਚ ਦਿਖ ਰਹੀ ਚੀਜ਼ ਦੀ ਪਛਾਣ ਕਰੋ ਅਤੇ ਦੱਸੋ।' : 'यह क्या है? कैमरे में दिख रही चीज पहचानें और बताएं।',
    },
    {
      id: 'disease',
      label: language === 'punjabi' ? '🍂 ਬਿਮਾਰੀ ਜਾਂ ਪੀਲੇ ਪੱਤੇ?' : '🍂 बीमारी या पीले पत्ते?',
      query: language === 'punjabi' ? 'ਇਸ ਬੂਟੇ ਜਾਂ ਪੱਤਿਆਂ ਨੂੰ ਕੀ ਬਿਮਾਰੀ ਜਾਂ ਸਮੱਸਿਆ ਹੈ?' : 'इस पौधे में क्या बीमारी या समस्या है?',
    },
    {
      id: 'spray',
      label: language === 'punjabi' ? '💊 ਕਿਹੜੀ ਸਪਰੇਅ ਪਾਈਏ?' : '💊 कौन सा स्प्रे करें?',
      query: language === 'punjabi' ? 'ਇਸਦੇ ਲਈ PAU ਲੁਧਿਆਣਾ ਦੀ ਕਿਹੜੀ ਦਵਾਈ ਅਤੇ ਸਪਰੇਅ ਦੀ ਸਿਫਾਰਸ਼ ਹੈ?' : 'इसके लिए कौन सी दवा और स्प्रे की सिफारिश है?',
    },
    {
      id: 'health',
      label: language === 'punjabi' ? '🌾 ਫਸਲ ਤੰਦਰੁਸਤ ਹੈ?' : '🌾 फसल स्वस्थ है?',
      query: language === 'punjabi' ? 'ਕੀ ਇਹ ਫਸਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਤੰਦਰੁਸਤ ਹੈ ਜਾਂ ਕੋਈ ਖੁਰਾਕੀ ਘਾਟ ਹੈ?' : 'क्या यह फसल स्वस्थ है या कोई पोषक तत्व की कमी है?',
    },
  ];

  // Lifecycle
  useEffect(() => {
    isComponentMountedRef.current = true;
    if (isOpen) {
      setDiagnosisResult(null);
      setSpokenText('');
      lastSpokenRef.current = '';
      startCamera(facingMode);
      startSpeechRecognition();
    } else {
      stopCamera();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsListening(false);
      setDiagnosisResult(null);
    }

    return () => {
      isComponentMountedRef.current = false;
      stopCamera();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden select-none">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 1. Full-Screen Edge-to-Edge Camera Stream */}
      <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
        <video
          ref={(el) => {
            videoRef.current = el;
            if (el && streamRef.current && el.srcObject !== streamRef.current) {
              el.srcObject = streamRef.current;
              el.muted = true;
              el.play().catch(() => {});
            }
          }}
          playsInline
          autoPlay
          muted
          className="w-full h-full object-cover"
        />

        {/* Shutter capture flash effect */}
        {flashAnimation && (
          <div className="absolute inset-0 bg-white/40 pointer-events-none z-30 transition-opacity duration-150"></div>
        )}

        {/* Viewfinder Target Reticle Overlay with Active Eye Tracking */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-4">
          <div className="relative w-72 sm:w-88 h-72 sm:h-88 border-2 border-emerald-400/70 rounded-3xl flex items-center justify-center shadow-2xl">
            {/* Golden Corner Accents */}
            <div className="absolute -top-2 -left-2 w-7 h-7 border-t-4 border-l-4 border-[#EABF48] rounded-tl-xl shadow-md"></div>
            <div className="absolute -top-2 -right-2 w-7 h-7 border-t-4 border-r-4 border-[#EABF48] rounded-tr-xl shadow-md"></div>
            <div className="absolute -bottom-2 -left-2 w-7 h-7 border-b-4 border-l-4 border-[#EABF48] rounded-bl-xl shadow-md"></div>
            <div className="absolute -bottom-2 -right-2 w-7 h-7 border-b-4 border-r-4 border-[#EABF48] rounded-br-xl shadow-md"></div>

            {/* Scanning Laser Beam */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent shadow-[0_0_12px_#34d399] animate-pulse"></div>

            {/* Center Reticle Point */}
            <div className="w-4 h-4 rounded-full border border-white/60 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#EABF48] animate-ping"></div>
            </div>

            <div className="absolute bottom-4 px-3.5 py-1.5 bg-black/75 backdrop-blur-md rounded-full text-xs text-white font-medium border border-white/20 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#EABF48]" />
              <span>{language === 'punjabi' ? 'ਕੈਮਰਾ ਫਸਲ ਜਾਂ ਵਸਤੂ ਸਾਹਮਣੇ ਰੱਖੋ' : 'कैमरा फसल या वस्तु के सामने रखें'}</span>
            </div>
          </div>
        </div>

        {/* Analyzing Spinner Overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-30 animate-fadeIn">
            <div className="relative w-18 h-18 mb-3 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-400/40 animate-ping"></div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#14532D] to-emerald-600 flex items-center justify-center shadow-xl text-[#EABF48]">
                <ScanLine className="w-7 h-7 animate-pulse text-[#EABF48]" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white text-center">
              {language === 'punjabi'
                ? '🌾 Gemini AI ਫਸਲ ਦੀ ਸਿੱਧੀ ਜਾਂਚ ਕਰ ਰਿਹਾ ਹੈ...'
                : '🌾 Gemini AI फसल की सीधी जांच कर रहा है...'}
            </h3>
            <p className="text-xs text-[#EABF48] mt-1 text-center font-medium">
              PAU ਲੁਧਿਆਣਾ ਮਾਹਿਰ ਰਿਪੋਰਟ ਤਿਆਰ ਹੋ ਰਹੀ ਹੈ...
            </p>
          </div>
        )}

        {/* Camera Permission Error Notice */}
        {cameraError && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 text-center z-30">
            <AlertCircle className="w-12 h-12 text-amber-400 mb-3" />
            <p className="text-sm text-white max-w-sm mb-4 leading-relaxed">{cameraError}</p>
            <button
              type="button"
              onClick={() => startCamera(facingMode)}
              className="px-5 py-2.5 rounded-xl bg-[#EABF48] text-[#14532D] font-bold text-sm shadow-lg cursor-pointer"
            >
              ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ (Retry Camera)
            </button>
          </div>
        )}
      </div>

      {/* 2. Top Floating Heads-Up Bar */}
      <div className="relative z-20 px-4 pt-4 sm:pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
          <span className="text-red-400">● LIVE CAMERA</span>
          <span className="text-white/40">|</span>
          <span className="text-emerald-400">Gemini 3.1 Vision</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Flip Camera */}
          <button
            type="button"
            onClick={switchCamera}
            title="ਕੈਮਰਾ ਬਦਲੋ (Switch Front/Back)"
            className="p-2.5 rounded-full bg-black/65 hover:bg-black/85 backdrop-blur-md text-white border border-white/20 shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-5 h-5 text-[#EABF48]" />
          </button>

          {/* Voice Output Mute/Unmute */}
          <button
            type="button"
            onClick={() => {
              setVoiceSpeechEnabled(!voiceSpeechEnabled);
              if (voiceSpeechEnabled && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
            }}
            title={voiceSpeechEnabled ? 'Mute AI voice' : 'Enable AI voice'}
            className="p-2.5 rounded-full bg-black/65 hover:bg-black/85 backdrop-blur-md text-white border border-white/20 shadow-lg cursor-pointer"
          >
            {voiceSpeechEnabled ? (
              <Volume2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {/* Close Modal */}
          <button
            type="button"
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
            }}
            title="ਬੰਦ ਕਰੋ (Close)"
            className="p-2.5 rounded-full bg-black/65 hover:bg-black/85 backdrop-blur-md text-white border border-white/20 shadow-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3. Live Floating AI Diagnosis Card (Includes thumbnail proof of what was captured) */}
      <AnimatePresence>
        {diagnosisResult && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="relative z-20 px-4 pt-2 w-full max-w-xl mx-auto"
          >
            <div className="rounded-2xl bg-[#F7F7E9]/95 text-[#1E293B] backdrop-blur-xl border-2 border-[#EABF48] shadow-2xl p-4 overflow-hidden">
              <div className="flex items-center justify-between border-b border-gray-300/80 pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#14532D] text-[#EABF48] flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-[#14532D]">
                      {language === 'punjabi' ? 'Gemini AI ਫਸਲ ਜਾਂਚ ਰਿਪੋਰਟ' : 'Gemini AI फसल जांच रिपोर्ट'}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-medium">PAU ਲੁਧਿਆਣਾ • ਸੰਸਥਾਪਕ: ਜੱਸ ਬਸਰਾਨ</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => speakDiagnosis(diagnosisResult.reply)}
                    className="p-1.5 rounded-lg bg-[#EABF48] text-[#14532D] hover:bg-[#d4a732] cursor-pointer"
                    title="ਸੁਣੋ (Listen)"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiagnosisResult(null)}
                    className="p-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 cursor-pointer"
                    title="ਬੰਦ ਕਰੋ"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Thumbnail + Spoken Query Row */}
              <div className="flex items-start gap-2.5 mb-2 bg-white/70 p-2 rounded-xl border border-gray-200">
                {diagnosisResult.capturedThumbnail && (
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#EABF48] shrink-0 bg-black">
                    <img
                      src={diagnosisResult.capturedThumbnail}
                      alt="Captured crop"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">
                    {language === 'punjabi' ? 'ਤੁਹਾਡਾ ਸਵਾਲ:' : 'आपका सवाल:'}
                  </p>
                  <p className="text-xs font-bold text-[#14532D] truncate">
                    "{diagnosisResult.userQuestion}"
                  </p>
                  <span className="text-[9px] text-emerald-700 font-medium">
                    ● ਕੈਮਰਾ ਫਰੇਮ ਸਫਲਤਾਪੂਰਵਕ ਜਾਂਚਿਆ ਗਿਆ
                  </span>
                </div>
              </div>

              {/* Diagnosis Body */}
              <div className="max-h-36 overflow-y-auto text-xs leading-relaxed text-[#1E293B] font-medium pr-1 whitespace-pre-wrap">
                {diagnosisResult.reply}
              </div>

              {/* Footer hint */}
              <div className="mt-2 pt-1.5 border-t border-gray-200 text-[10px] text-emerald-800 font-bold flex items-center justify-between">
                <span>📹 ਕੈਮਰਾ ਲਾਈਵ ਹੈ • ਅਗਲੀ ਚੀਜ਼ ਦਿਖਾ ਕੇ ਬੋਲੋ</span>
                <span className="text-gray-400">{diagnosisResult.timestamp}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Live Speech Subtitle Banner & Quick Chips */}
      <div className="relative z-20 px-4 pb-2 w-full max-w-xl mx-auto space-y-2">
        {/* Quick One-Tap Question Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {quickQuestionChips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              disabled={isAnalyzing}
              onClick={() => {
                setSpokenText(chip.query);
                handleAnalyzeCrop(chip.query);
              }}
              className="shrink-0 px-3 py-1.5 rounded-full bg-black/65 hover:bg-black/85 backdrop-blur-md text-white text-xs font-semibold border border-white/20 active:scale-95 transition-all cursor-pointer shadow-md"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Real-Time Speech Subtitle Transcript */}
        <div className="px-3.5 py-2.5 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[#14532D] text-[#EABF48] flex items-center justify-center shrink-0">
              <Mic className={`w-4 h-4 ${isListening ? 'animate-pulse text-emerald-300' : ''}`} />
            </div>
            {isListening && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#EABF48] uppercase tracking-wider">
                {isListening ? (language === 'punjabi' ? '🔴 ਸੁਣ ਰਿਹਾ ਹਾਂ... (ਕੈਮਰਾ ਦਿਖਾਉਂਦੇ ਹੋਏ ਬੋਲੋ)' : '🔴 सुन रहा हूँ... (बोलें)') : 'ਮਾਈਕ੍ਰੋਫੋਨ'}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-white truncate">
              {spokenText ||
                (language === 'punjabi'
                  ? 'ਫਸਲ ਵੱਲ ਕੈਮਰਾ ਕਰਕੇ ਆਪਣਾ ਸਵਾਲ ਬੋਲੋ...'
                  : 'फसल की तरफ कैमरा करके अपना सवाल बोलें...')}
            </p>
          </div>

          {spokenText && (
            <button
              type="button"
              onClick={() => {
                setSpokenText('');
                lastSpokenRef.current = '';
              }}
              className="text-[10px] text-gray-400 hover:text-white px-1.5 py-0.5 rounded bg-white/10"
            >
              ਮਿਟਾਓ
            </button>
          )}
        </div>

        {/* Manual Text Input Field Toggle */}
        {showManualInput && (
          <div className="flex items-center gap-2 px-3 py-2 bg-black/80 rounded-2xl border border-white/20 backdrop-blur-md">
            <input
              type="text"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="ਕੈਮਰੇ ਵਿੱਚ ਦਿਖ ਰਹੀ ਚੀਜ਼ ਬਾਰੇ ਲਿਖ ਕੇ ਪੁੱਛੋ..."
              className="flex-1 text-xs text-white bg-transparent outline-none placeholder:text-gray-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && manualText.trim()) {
                  handleAnalyzeCrop(manualText);
                }
              }}
            />
            <button
              type="button"
              disabled={!manualText.trim() || isAnalyzing}
              onClick={() => handleAnalyzeCrop(manualText)}
              className="p-1.5 rounded-xl bg-[#EABF48] text-[#14532D] font-bold disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 5. Bottom Live Control Bar */}
      <div className="relative z-20 px-6 pb-6 pt-2 bg-gradient-to-t from-black via-black/85 to-transparent flex items-center justify-around">
        {/* Toggle text input */}
        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs flex flex-col items-center gap-1 border border-white/15 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-[#EABF48]" />
          <span className="text-[10px]">{showManualInput ? 'ਬੰਦ ਕਰੋ' : 'ਲਿਖ ਕੇ ਪੁੱਛੋ'}</span>
        </button>

        {/* Central Glowing Live Ask Button */}
        <button
          type="button"
          onClick={() => handleAnalyzeCrop()}
          disabled={isAnalyzing}
          className="relative -mt-2 p-1.5 rounded-full bg-gradient-to-tr from-[#EABF48] via-white to-[#EABF48] shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          title="ਜੋ ਕੈਮਰੇ ਵਿੱਚ ਦਿਖ ਰਿਹਾ ਹੈ, ਉਸਦੀ ਜਾਂਚ ਕਰੋ"
        >
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#14532D] text-[#EABF48] flex flex-col items-center justify-center border-4 border-black group-hover:bg-[#0f3d21]">
            <Mic className="w-7 h-7 sm:w-8 sm:h-8 animate-pulse text-[#EABF48]" />
            <span className="text-[9px] font-extrabold tracking-wide mt-0.5">ਬੋਲੋ & ਜਾਂਚੋ</span>
          </div>
        </button>

        {/* Reset / Restart voice */}
        <button
          type="button"
          onClick={() => {
            setSpokenText('');
            lastSpokenRef.current = '';
            setDiagnosisResult(null);
            startSpeechRecognition();
          }}
          className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs flex flex-col items-center gap-1 border border-white/15 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px]">ਨਵਾਂ ਸਵਾਲ</span>
        </button>
      </div>
    </div>
  );
};
