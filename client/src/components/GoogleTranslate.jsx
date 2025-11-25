import React, { useEffect } from 'react';

const GoogleTranslate = () => {
  useEffect(() => {
    // Check if Google Translate is loaded
    const checkGoogleTranslate = setInterval(() => {
      if (window.google && window.google.translate) {
        clearInterval(checkGoogleTranslate);
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
        padding: 4px 8px;
        border-radius: 6px;
        border: 1px solid #e2e8f0;
        background: white;
        font-size: 14px;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);

    return () => {
      clearInterval(checkGoogleTranslate);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="google-translate-wrapper">
      <div id="google_translate_element"></div>
    </div>
  );
};

export default GoogleTranslate;
