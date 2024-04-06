import React, { useState, useEffect } from 'react'

const TypewriterForLI = ({ texts, delay }) => {
  const [currentText, setCurrentText] = useState('')
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentTextIndex < texts.length) {
      if (currentIndex < texts[currentTextIndex].length) {
        const timeout = setTimeout(() => {
          setCurrentText((prevText) => prevText + texts[currentTextIndex][currentIndex])
          setCurrentIndex((prevIndex) => prevIndex + 1)
        }, delay)

        return () => clearTimeout(timeout)
      } else {
        setTimeout(() => {
          setCurrentText('')
          setCurrentIndex(0)
          setCurrentTextIndex((prevIndex) => prevIndex + 1)
        }, delay * 30) // Wait a bit longer at the end of each text
      }
    }
  }, [currentIndex, currentTextIndex, delay, texts])

  return <span>{currentText}</span>
}
export default TypewriterForLI
