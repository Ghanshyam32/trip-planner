'use client';

import React, { useState } from 'react';
import { TripPlan } from '@/types';

interface ItineraryDisplayProps {
  plan: TripPlan | null;
  isLoading: boolean;
}

export default function ItineraryDisplay({ plan, isLoading }: ItineraryDisplayProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(1); // Day 1 expanded by default

  const toggleDay = (day: number) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-text" style={{ width: '80%', marginBottom: '2rem' }}></div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-panel" style={{ padding: '1.5rem 2rem' }}>
              <div className="skeleton skeleton-text" style={{ width: '30%', marginBottom: '1rem' }}></div>
              <div className="skeleton skeleton-box"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
      <h2 className="gradient-text">Your Itinerary</h2>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>{plan.summary}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {plan.itinerary.map((dayPlan) => (
          <div key={dayPlan.day} className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
            <div 
              className="accordion-header"
              onClick={() => toggleDay(dayPlan.day)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h3 style={{ margin: 0, color: 'var(--accent-color)' }}>Day {dayPlan.day}</h3>
                <span style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-primary)' }}>{dayPlan.theme}</span>
              </div>
              <div style={{ fontSize: '1.5rem', transition: 'transform 0.3s', transform: expandedDay === dayPlan.day ? 'rotate(180deg)' : 'rotate(0)' }}>
                ▼
              </div>
            </div>

            <div className={`accordion-content ${expandedDay === dayPlan.day ? 'expanded' : ''}`}>
              <div className="accordion-inner">
                <div style={{ padding: '1.5rem 2rem' }}>
                  
                  {dayPlan.localSecret && (
                    <div className="local-secret">
                      <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-color)', fontWeight: 600, marginBottom: '0.25rem' }}>
                        Local Secret
                      </div>
                      <div>{dayPlan.localSecret}</div>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {dayPlan.activities.map((activity, index) => {
                      const badgeClass = activity.time.toLowerCase() === 'morning' ? 'badge-morning' 
                        : activity.time.toLowerCase() === 'afternoon' ? 'badge-afternoon' 
                        : 'badge-evening';
                        
                      return (
                        <div key={index} className="slot-card">
                          <div className="slot-header">
                            <div>
                              <span className={`badge ${badgeClass}`} style={{ marginBottom: '0.5rem' }}>{activity.time}</span>
                              <h4 style={{ fontSize: '1.2rem', margin: '0.5rem 0 0 0' }}>{activity.name}</h4>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ color: 'var(--accent-color)', fontWeight: 600, fontSize: '1.1rem' }}>
                                {formatINR(activity.estimatedCostINR)}
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                {activity.duration}
                              </div>
                            </div>
                          </div>
                          
                          <p style={{ margin: 0, fontSize: '0.95rem' }}>{activity.description}</p>
                          
                          {activity.proTip && (
                            <div className="pro-tip">
                              <span style={{ fontWeight: 600, color: '#ff007f', marginRight: '0.5rem' }}>Pro Tip:</span>
                              {activity.proTip}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
