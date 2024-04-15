import React, { useState, useEffect } from 'react';

const Typewriter2 = ({ sentences, typingDelay = 75, nextSentenceDelay = 2000 }) => {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [displayedSentences, setDisplayedSentences] = useState([]);

    useEffect(() => {
        if (subIndex <= sentences[index].length) {
            const timeout = setTimeout(() => {
                setDisplayedSentences(current => [
                    ...current.slice(0, index), // Previous sentences
                    sentences[index].substring(0, subIndex) // Current sentence in progress
                ]);
                setSubIndex(subIndex + 1); // Move to next character
            }, typingDelay);

            return () => clearTimeout(timeout);
        } else {
            if (index < sentences.length - 1) {
                setTimeout(() => {
                    setSubIndex(0);
                    setIndex(index + 1);
                }, nextSentenceDelay);
            }
        }
    }, [subIndex, index, sentences, typingDelay, nextSentenceDelay]);

    // Inline style for the typewriter text container
    const typewriterStyle = {
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: '15px',
        color: '#333',
        // backgroundColor: '#f4f4f4',
        padding: '10px',
        margin: '20px auto',
        // border: '1px solid #ccc',
        whiteSpace: 'pre-wrap',
        width: '100%',
        maxWidth: '600px',
        textAlign: 'left',
        lineHeight: '1'
    };

    return (
        <div style={typewriterStyle}>
            {displayedSentences.map((sentence, i) => (
                <p key={i}>&bull; {sentence}</p> // Display each sentence with a bullet point
            ))}
        </div>
    );
};

export default Typewriter2;
