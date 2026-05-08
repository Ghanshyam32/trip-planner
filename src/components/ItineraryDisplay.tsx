'use client';

import React from 'react';
import { TripPlan } from '@/types';

interface ItineraryDisplayProps {
  plan: TripPlan;
}

export default function ItineraryDisplay({ plan }: ItineraryDisplayProps) {
  return (
    <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
      <h2 className="gradient-text">Your Itinerary</h2>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>{plan.summary}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {plan.itinerary.map((dayPlan) => (
          <div key={dayPlan.day} className="glass-panel" style={{ padding: '1.5rem 2rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--panel-border)', paddingBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, color: 'var(--accent-color)' }}>Day {dayPlan.day}</h3>
              <span style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-primary)' }}>{dayPlan.theme}</span>
            </div>

            <div className="grid grid-3" style={{ gap: '1.5rem' }}>
              {dayPlan.activities.map((activity, index) => (
                <div key={index} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 600 }}>
                    {activity.time}
                  </div>
                  <div style={{ fontSize: '0.95rem' }}>
                    {activity.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
