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
    return null; // Handled by page.tsx now
  }

  if (!plan) return null;

  // Assuming the destination is somewhat parseable from the plan context or we could pass it in.
  // We'll extract destination from the summary or just rely on a generic travel image if not passed directly.
  // Actually, we can just use the destination from the page context, but we don't have it directly here.
  // For now, let's just use "travel" as the keyword for the hero image to ensure it works.
  const imageUrl = `https://loremflickr.com/800/400/travel,city/all`;

  return (
    <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
      <div style={{
        width: '100%',
        height: '250px',
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '2rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }} />

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
                  
                  {/* Hotel Ranges */}
                  {dayPlan.hotelRanges && (
                    <div className="hotel-ranges">
                      <div className="hotel-range-card">
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Budget Stay</div>
                        <div style={{ fontWeight: 600 }}>{dayPlan.hotelRanges.budget} / night</div>
                      </div>
                      <div className="hotel-range-card">
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Mid-Range Stay</div>
                        <div style={{ fontWeight: 600 }}>{dayPlan.hotelRanges.midRange} / night</div>
                      </div>
                      <div className="hotel-range-card">
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Luxury Stay</div>
                        <div style={{ fontWeight: 600 }}>{dayPlan.hotelRanges.luxury} / night</div>
                      </div>
                    </div>
                  )}
                  
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
