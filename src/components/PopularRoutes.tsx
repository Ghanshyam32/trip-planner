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

  const handleSelect = (route: any) => {
    // Generate dates: Today to Today + 5 days
    const today = new Date();
    const future = new Date(today);
    future.setDate(today.getDate() + 5);

    const start = today.toISOString().split('T')[0];
    const end = future.toISOString().split('T')[0];

    onSelect({
      source: route.source,
      destination: route.destination,
      startDate: start,
      endDate: end,
      budget: 80000,
      travelerType: 'Solo',
      vibe: route.vibe,
      pace: route.pace,
      transport: 'Flight only'
    });
  };

  return (
    <div style={{ marginBottom: '3rem' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>🌍 Explore Popular Routes</h3>
      <div className="grid grid-3" style={{ gap: '1.5rem' }}>
        {routes.map((route, idx) => (
          <div 
            key={idx} 
            className="image-card"
            onClick={() => handleSelect(route)}
          >
            <div 
              className="image-card-bg"
              role="img"
              aria-label={`Photo of ${route.destination}`}
              style={{ backgroundImage: `url(https://picsum.photos/seed/${route.destination.toLowerCase()}/400/300)` }}
            />
            <div className="image-card-overlay" />
            
            <div className="image-card-content">
              <div style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.25rem', color: 'white' }}>
                {route.source} ✈️ {route.destination}
              </div>
              <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)' }}>
                {route.tagline}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
