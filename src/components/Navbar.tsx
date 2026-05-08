'use client';

import React from 'react';

export default function Navbar() {
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80; // Offset for navbar
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} role="button" aria-label="Go to top">
          <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }} role="img" aria-label="Plane logo">✈️</span>
          <span className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 700 }}>Aura Trip</span>
        </div>
        
        <div className="navbar-links">
          <button className="nav-link" aria-label="View Popular Routes" onClick={() => handleScroll('routes')}>Popular Routes</button>
          <button className="nav-link" aria-label="Plan a Trip" onClick={() => handleScroll('form')}>Plan Trip</button>
          <button className="nav-link" aria-label="Learn How it Works" onClick={() => handleScroll('how-it-works')}>How it Works</button>
        </div>
      </div>
    </nav>
  );
}
