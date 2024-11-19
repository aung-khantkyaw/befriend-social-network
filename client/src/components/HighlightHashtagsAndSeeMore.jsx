import { useState } from "react";
import PropTypes from "prop-types";

export default function HighlightHashtagsAndSeeMore({
  content,
  maxLength = 150,
}) {
  // Function to highlight hashtags in the content
  const highlightHashtags = (text) => {

    // Split the content into words, and map through them
    return text.split(/(?<=[.?])\s+/).map((word, index) => {
      // If the word is a hashtag, wrap it in a styled span
      if (word.startsWith("#")) {
        return (
          <span key={index} style={{ color: "blue", fontWeight: "bold" }}>
            {word}{" "}
          </span>
        );
      } else {
        return <span key={index}>{word} </span>; // Add space after non-hashtag words
      }
    });
  };

  // Handle the 'Read More' feature
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  const displayedContent = isExpanded ? content : content.slice(0, maxLength);

  return (
    <div>
      <p className="mb-4">
        {highlightHashtags(displayedContent)}{" "}
        {/* Highlight hashtags within the content */}
        {content.length > maxLength && (
          <span
            onClick={toggleExpand}
            style={{
              color: "blue",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {isExpanded ? " Read less" : " Read more..."}
          </span>
        )}
      </p>
    </div>
  );
}

HighlightHashtagsAndSeeMore.propTypes = {
  content: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
};
