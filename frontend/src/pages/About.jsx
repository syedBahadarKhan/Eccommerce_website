import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page container animate-fade">
      <div className="about-header">
        <h1 className="about-title">Our Story</h1>
        <p className="about-subtitle">Redefining modern luxury and style in Pakistan</p>
      </div>

      <div className="about-content-split">
        <div className="about-image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800"
            alt="Handcrafting process"
            className="about-image"
          />
        </div>
        <div className="about-text-wrapper">
          <h2>Crafted with Precision</h2>
          <p>
            Founded in 2026, Elegant Fashion was born out of a desire to create clean, sophisticated, and premium-grade items that elevate daily lifestyles. We believe that true luxury lies in the details—from selection of raw grain leathers to selection of hardware accents.
          </p>
          <p>
            Each watch, bag, sneaker, and accessory in our collection is carefully curated and made to reflect elegance and durability. Our designs do not follow seasonal trends; they are created to last and become timeless staples in your wardrobe.
          </p>
          <blockquote>
            "Simplicity is the keynote of all true elegance."
          </blockquote>
          <p>
            By working directly with local master craftsmen and utilizing advanced sourcing, we ensure ethical production standards and exceptional quality. We are proud to serve our community across Pakistan, providing them with luxury styles without the standard high-end retail markups.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
