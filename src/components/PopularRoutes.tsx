'use client';

import React from 'react';
import { TripRequest } from '@/types';

interface PopularRoutesProps {
  onSelect: (route: Partial<TripRequest>) => void;
}

export default function PopularRoutes({ onSelect }: PopularRoutesProps) {
  const routes = [
    { source: 'Delhi', destination: 'Dubai', tagline: 'Desert Safari & Luxury', vibe: 'Luxury', pace: 'Balanced' },
    { source: 'Mumbai', destination: 'Bali', tagline: 'Tropical Paradise', vibe: 'Relaxation', pace: 'Relaxed' },
    { source: 'Delhi', destination: 'Goa', tagline: 'Sun, Sand & Sea', vibe: 'Nightlife', pace: 'Packed' },
    { source: 'Bangalore', destination: 'Manali', tagline: 'Himalayan Escape', vibe: 'Adventure', pace: 'Balanced' },
    { source: 'Mumbai', destination: 'Paris', tagline: 'City of Love', vibe: 'Food & Culture', pace: 'Packed' },
    { source: 'Chennai', destination: 'Singapore', tagline: 'Urban Exploration', vibe: 'Mixed', pace: 'Packed' }
  ];

  return (
    <div style={{ marginBottom: '3rem' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Popular Routes</h3>
      <div className="grid grid-3" style={{ gap: '1rem' }}>
        {routes.map((route, idx) => (
          <div 
            key={idx} 
            className="route-card"
            onClick={() => onSelect({
              source: route.source,
              destination: route.destination,
              vibe: route.vibe,
              pace: route.pace
            })}
          >
            <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--accent-color)' }}>
              {route.source} ✈️ {route.destination}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {route.tagline}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
