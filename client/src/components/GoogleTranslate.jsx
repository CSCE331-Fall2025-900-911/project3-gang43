import React, { useEffect } from 'react';

const GoogleTranslate = () => {
  useEffect(() => {
    // Initialize Google Translate when the component mounts
    const initializeGoogleTranslate = () => {
      if (window.google && window.google.translate) {
        // Clear any existing translate element
        const existingElement = document.getElementById('google_translate_element');
        if (existingElement) {
          existingElement.innerHTML = '';
        }

        // Initialize the Google Translate widget
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,es,zh-CN,zh-TW,vi,ko,ja,tl,fr,de',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          },
          'google_translate_element'
        );
      }
    };

    // Check if Google Translate is loaded, if not wait for it
    const checkGoogleTranslate = setInterval(() => {
      if (window.google && window.google.translate) {
        clearInterval(checkGoogleTranslate);
        initializeGoogleTranslate();
      }
    }, 100);

    // Add custom styles to hide Google Translate branding
    const style = document.createElement('style');
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
    `;
    document.head.appendChild(style);

    return () => {
      clearInterval(checkGoogleTranslate);
      if (style.parentNode) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div className="google-translate-wrapper">
      <div id="google_translate_element"></div>
    </div>
  );
};

export default GoogleTranslate;
