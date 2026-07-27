import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [fontSize, setFontSize] = useState(16); // base font size in pixels
  const [siteColor, setSiteColor] = useState('normal'); // 'normal', 'bw' (black/white), 'wb' (white/black), 'wb-blue' (white/blue), 'sepia' (yellow/brown)
  const [showImages, setShowImages] = useState(true);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Apply font size to document element
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    if (!showImages) {
      document.body.classList.add('hide-images');
    } else {
      document.body.classList.remove('hide-images');
    }
  }, [showImages]);

  useEffect(() => {
    // Remove old classes
    document.body.classList.remove('theme-bw', 'theme-wb', 'theme-wb-blue', 'theme-sepia');
    
    // Add new class if not normal
    if (siteColor !== 'normal') {
      document.body.classList.add(`theme-${siteColor}`);
    }
  }, [siteColor]);

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12));
  };

  const resetSettings = () => {
    setFontSize(16);
    setSiteColor('normal');
    setShowImages(true);
    setSpeechEnabled(false);
  };

  return (
    <AccessibilityContext.Provider value={{
      fontSize,
      siteColor,
      showImages,
      speechEnabled,
      isOpen,
      setIsOpen,
      setSiteColor,
      setShowImages,
      setSpeechEnabled,
      increaseFontSize,
      decreaseFontSize,
      resetSettings
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}
