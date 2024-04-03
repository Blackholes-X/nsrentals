import React, { useState, useEffect } from 'react';

const Typewriter = ({ text, delay }) => {
  const [currentText, setCurrentText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false); // New state to track completion

  useEffect(() => {
    // Check if animation is completed; if so, do nothing.
    if (isCompleted || currentText.length === text.length) {
      setIsCompleted(true);
      return;
    }

    // Typing animation logic
    const timerId = setTimeout(() => {
      setCurrentText(prev => prev + text[currentText.length]);
    }, delay);

    // Cleanup function to clear the timeout
    return () => clearTimeout(timerId);
  }, [currentText, delay, text, isCompleted]); // Depend on isCompleted to avoid re-triggering after completion

  return <span>{currentText}</span>;
};

export default Typewriter;
