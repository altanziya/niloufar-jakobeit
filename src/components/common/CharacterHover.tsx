'use client';

import React from 'react';

// Character Hover Component - Einfache Version
const CharacterHover = ({ 
  text = "", 
  className = "",
  style = {},
  isPreloader = false,
}: {
  text?: string;
  className?: string;
  style?: React.CSSProperties;
  isPreloader?: boolean;
}) => {
  // Ensure text is always a string
  const safeText = text || "";
  
  return (
    <span className={className} style={style}>
      {safeText.split('').map((char, index) => (
        <span 
          key={index} 
          className="character-hover inline-block transition-colors duration-300 ease-out"
          style={{ color: 'black' }}
          aria-hidden={char === ' ' ? true : undefined}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

export default CharacterHover;