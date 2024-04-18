import React, { useState, useEffect } from 'react'
const ExpandableText = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  // Assuming you want to show first 100 characters if not expanded
  const shortText = `${text.substring(0, 100)}...`;

  return (
    <div>
      <p>{isExpanded ? text : shortText}</p>
      <button onClick={toggleExpanded} className="text-blue-500">
        {isExpanded ? 'View Less' : 'Expand description'}
      </button>
    </div>
  );
};
export default ExpandableText;