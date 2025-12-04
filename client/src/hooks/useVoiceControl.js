import { useState, useEffect, useCallback, useRef } from 'react';

const useVoiceControl = ({ onCommand, enabled = true }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if browser supports Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('Voice control is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    setIsSupported(true);

    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Auto-restart if still enabled
      if (enabled && recognitionRef.current) {
        try {
          recognition.start();
        } catch (err) {
          console.log('Recognition restart error:', err);
        }
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        // Ignore no-speech errors as they're common
        return;
      }
      if (event.error === 'aborted') {
        // Ignore aborted errors when stopping
        return;
      }
      setError(`Voice recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(interimTranscript || finalTranscript);

      // Process final transcript
      if (finalTranscript) {
        const command = finalTranscript.trim().toLowerCase();
        if (onCommand) {
          onCommand(command);
        }
        // Clear transcript after processing
        setTimeout(() => setTranscript(''), 2000);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [onCommand, enabled]);

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) return;

    try {
      recognitionRef.current.start();
    } catch (err) {
      if (err.message.includes('already started')) {
        // Already listening, ignore
        return;
      }
      console.error('Error starting voice recognition:', err);
      setError('Failed to start voice recognition');
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    transcript,
    isSupported,
    error,
    startListening,
    stopListening,
    toggleListening,
  };
};

export default useVoiceControl;
