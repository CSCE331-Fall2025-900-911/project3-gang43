import React, { useEffect, useRef } from 'react';

const GoogleTranslate = () => {
  const isInitialized = useRef(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitialized.current) return;

    // Define the callback function that Google Translate will call
    window.googleTranslateElementInit = () => {
      if (isInitialized.current) return;

      const existingElement = document.getElementById('google_translate_element');
      if (existingElement && existingElement.innerHTML.trim() === '') {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,es,zh-CN,zh-TW,vi,ko,ja,tl,fr,de,it,pt,ru,ar,hi,th,id,ms,tr,pl,nl,sv,da,no,fi,he,el',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
              multilanguagePage: true
            },
            'google_translate_element'
          );
          isInitialized.current = true;
        } catch (error) {
          console.error('Error initializing Google Translate:', error);
          isInitialized.current = false;
        }
      }
    };

    // Wait for the script to load with a slight delay to ensure stability
    const initTimeout = setTimeout(() => {
      if (window.google && window.google.translate && !isInitialized.current) {
        window.googleTranslateElementInit();
      }
    }, 500);

    // Add custom styles only once
    if (!document.getElementById('google-translate-styles')) {
      const style = document.createElement('style');
      style.id = 'google-translate-styles';
      style.innerHTML = `
        .goog-te-banner-frame.skiptranslate {
          display: none !important;
        }
        body {
          top: 0px !important;
        }
        .goog-te-gadget {
          font-size: 0;
        }
        .goog-te-gadget > span {
          display: none !important;
        }
        .goog-te-gadget > div {
          display: inline-block;
        }
        .goog-te-combo {
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: white;
          font-size: 14px;
          cursor: pointer;
          font-family: inherit;
          color: #0f172a;
        }
        .goog-te-combo:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .skiptranslate iframe {
          visibility: hidden !important;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      clearTimeout(initTimeout);
    };
  }, []);

  return (
    <div className="google-translate-wrapper">
      <div id="google_translate_element"></div>
    </div>
  );
};

export default GoogleTranslate;
