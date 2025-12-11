import React from 'react';
import './BrandStoryPage.css';

// REPLACE THESE WITH YOUR ACTUAL IMAGE PATHS
// Example: import walkingImage from './assets/walking-woman.jpg';
const walkingImagePlaceholder = "/Rectangle 3.png";
const portraitImagePlaceholder = "/image 2.png";


const BrandStoryPage = () => {
  // We create a long string of Lorem Ipsum to match the visual density of the text block.
  const loremIpsumText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. 

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?`;

  return (
    <div className="brand-story-container">
      {/* Left Section: Red Background & Text */}
      <div className="text-content">
        <h1 className="brand-title">Brand Story</h1>
        <p className="brand-body-text">
          {loremIpsumText}
        </p>
      </div>

      {/* Right Section: Background Image */}
      <div className="right-image-container">
        <img 
          src={walkingImagePlaceholder} 
          alt="Woman walking in city" 
          className="background-image" 
        />
      </div>

      {/* The Overlapping Foreground Image */}
      <div className="overlap-image-container">
        <img 
          src={portraitImagePlaceholder} 
          alt="Portrait of woman in tweed" 
          className="foreground-image" 
        />
      </div>
    </div>
  );
};

export default BrandStoryPage;