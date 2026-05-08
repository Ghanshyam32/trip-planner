'use client';

import React, { useState } from 'react';
import { TripPlan, WeatherData } from '@/types';

interface ItineraryDisplayProps {
  plan: TripPlan | null;
  isLoading: boolean;
  destination: string;
  totalBudget: number;
  days: number;
  weatherData: WeatherData | null;
}

export default function ItineraryDisplay({ plan, isLoading, destination, totalBudget, days, weatherData }: ItineraryDisplayProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

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
    return null; 
  }

  if (!plan) return null;

  const imageUrl = `https://picsum.photos/seed/${destination.toLowerCase()}/1200/400`;
  const budgetPerDay = totalBudget / days;

  return (
    <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
      <div style={{
        width: '100%',
        height: '350px',
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '2rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        position: 'relative'
      }}>
        {/* Fallback gradient handled in CSS, but the image sits on top */}
      </div>

      {plan.funFacts && plan.funFacts.length > 0 && (
        <div className="fun-facts-container">
          {plan.funFacts.map((fact, idx) => (
            <div key={idx} className="fun-fact-pill">
              <span>💡</span> {fact}
            </div>
          ))}
        </div>
      )}

      <h2 className="gradient-text">Your Itinerary</h2>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>{plan.summary}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {plan.itinerary.map((dayPlan, index) => {
          // Weather for this day (index based, assuming weatherData.time maps 1:1)
          const dayWeather = weatherData && weatherData.time[index] ? {
            max: weatherData.temperature_2m_max[index],
            min: weatherData.temperature_2m_min[index],
            precip: weatherData.precipitation_probability_mean[index]
          } : null;

          return (
            <div key={dayPlan.day} className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
              <div 
                className="accordion-header"
                onClick={() => toggleDay(dayPlan.day)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, color: 'var(--accent-color)' }}>Day {dayPlan.day}</h3>
                  <span style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-primary)' }}>{dayPlan.theme}</span>
                  
                  {dayWeather && (
                    <div className="weather-widget" style={{ marginLeft: 'auto', marginRight: '1rem' }}>
                      <span>🌡️ {Math.round(dayWeather.max)}° / {Math.round(dayWeather.min)}°</span>
                      <span>🌧️ {dayWeather.precip}%</span>
                    </div>
                  )}
                </div>
                <div style={{ fontSize: '1.5rem', transition: 'transform 0.3s', transform: expandedDay === dayPlan.day ? 'rotate(180deg)' : 'rotate(0)' }}>
                  ▼
                </div>
              </div>

              <div className={`accordion-content ${expandedDay === dayPlan.day ? 'expanded' : ''}`}>
                <div className="accordion-inner">
                  <div style={{ padding: '1.5rem 2rem' }}>
                    
                    {/* Small Daily Thumbnail */}
                    <div style={{
                      width: '100%',
                      height: '200px',
                      backgroundImage: `url(https://picsum.photos/seed/${destination.toLowerCase()}_day${dayPlan.day}/800/400)`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '1.5rem'
                    }} />

                    {/* Hotel Ranges */}
                    {dayPlan.hotelRanges && (
                      <div className="hotel-ranges">
                        <div className={`hotel-range-card ${budgetPerDay < 2000 ? 'highlighted' : ''}`}>
                          {budgetPerDay < 2000 && <div className="hotel-recommended-badge">Recommended</div>}
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Budget Stay</div>
                          <div style={{ fontWeight: 600 }}>{dayPlan.hotelRanges.budget} / night</div>
                        </div>
                        <div className={`hotel-range-card ${(budgetPerDay >= 2000 && budgetPerDay <= 5000) ? 'highlighted' : ''}`}>
                          {(budgetPerDay >= 2000 && budgetPerDay <= 5000) && <div className="hotel-recommended-badge">Recommended</div>}
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Mid-Range Stay</div>
                          <div style={{ fontWeight: 600 }}>{dayPlan.hotelRanges.midRange} / night</div>
                        </div>
                        <div className={`hotel-range-card ${budgetPerDay > 5000 ? 'highlighted' : ''}`}>
                          {budgetPerDay > 5000 && <div className="hotel-recommended-badge">Recommended</div>}
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
          );
        })}
      </div>
      
      <div style={{ marginTop: '3rem' }}>
        <h3 className="gradient-text" style={{ marginBottom: '1.5rem' }}>Location Map</h3>
        <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', height: '400px' }}>
          <iframe 
            title={`Map of ${destination}`}
            width="100%" 
            height="100%" 
            frameBorder="0" 
            scrolling="no" 
            marginHeight={0} 
            marginWidth={0} 
            src={`https://maps.google.com/maps?q=${encodeURIComponent(destination)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
          />
        </div>
      </div>
    </div>
  );
}
