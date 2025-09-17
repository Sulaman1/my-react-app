import React, { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ScrollButtons = ({ scrollContainerRef }) => {
  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 500; // Adjust scroll amount as needed
      const currentScroll = scrollContainerRef.current.scrollLeft;
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="scroll-buttons-container">
      {/* <div className="scroll-buttons left-button">
        <button onClick={() => handleScroll('left')}>
          <FaChevronLeft color="#007BFF" />
        </button>
      </div> */}
      <div className="scroll-buttons right-button">
        <button onClick={() => handleScroll('right')}>
          <FaChevronRight color="#007BFF" />
        </button>
      </div>
    </div>
  );
};

export default ScrollButtons;