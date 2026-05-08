'use client';

import React, { useState } from 'react';
import TripForm from '@/components/TripForm';
import ItineraryDisplay from '@/components/ItineraryDisplay';
import CostBreakdown from '@/components/CostBreakdown';
import PopularRoutes from '@/components/PopularRoutes';
import { TripPlan, TripRequest, SimilarTrip } from '@/types';

export default function Home() {
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [similarTrips, setSimilarTrips] = useState<SimilarTrip[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSimilarLoading, setIsSimilarLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialFormValues, setInitialFormValues] = useState<Partial<TripRequest>>({});

  const generatePlan = async (request: TripRequest) => {
    setIsLoading(true);
    setError(null);
    setPlan(null);
    setSimilarTrips([]);
    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error('Failed to generate trip plan');
      }

      const data = await response.json();
      
      if (!data.itinerary || !data.costBreakdown) {
         throw new Error("Invalid response format from Gemini");
      }
      
      setPlan(data);
      
      // Fire off similar trips fetch in the background
      fetchSimilarTrips(request);
      
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSimilarTrips = async (request: TripRequest) => {
    setIsSimilarLoading(true);
    try {
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

      const response = await fetch('/api/similar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: request.source,
          destination: request.destination,
          budget: request.budget,
          days: days,
          vibe: request.vibe
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.similarTrips) {
          setSimilarTrips(data.similarTrips);
        }
      }
    } catch (err) {
      console.error("Failed to fetch similar trips", err);
    } finally {
      setIsSimilarLoading(false);
    }
  };

  const resetPlan = () => {
    setPlan(null);
    setSimilarTrips([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRouteSelect = (route: Partial<TripRequest>) => {
    setInitialFormValues(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="container">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }} className="animate-fade-in">
        <h1>Aura Trip Planner</h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Discover the world with AI. Tell us your dreams, and we'll craft the perfect journey.
        </p>
      </div>

      {error && (
        <div className="glass-panel animate-fade-in" style={{ backgroundColor: 'rgba(255, 71, 87, 0.1)', borderColor: 'rgba(255, 71, 87, 0.3)', marginBottom: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#ff4757', margin: 0 }}>{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="thinking-container animate-fade-in">
          <div className="thinking-icon">✨</div>
          <h2 style={{ color: 'var(--accent-color)' }}>Crafting your perfect trip...</h2>
          <p>Analyzing routes, finding hidden gems, and optimizing your budget.</p>
        </div>
      ) : !plan ? (
        <>
          <PopularRoutes onSelect={handleRouteSelect} />
          <TripForm onSubmit={generatePlan} isLoading={false} initialValues={initialFormValues} />
        </>
      ) : (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ margin: 0 }}>Your Custom Journey is Ready</h2>
            <button onClick={resetPlan} className="btn-secondary">
              ← Edit Preferences / Re-plan
            </button>
          </div>
          
          <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                    <CostBreakdown costs={plan.costBreakdown} />
                </div>
              </div>

              <ItineraryDisplay plan={plan} isLoading={false} />
              
              {/* Similar Trips Section */}
              <div style={{ marginTop: '3rem' }}>
                <h3 className="gradient-text" style={{ marginBottom: '1.5rem' }}>Alternative Ideas</h3>
                {isSimilarLoading ? (
                  <div className="grid grid-2">
                     <div className="skeleton skeleton-box"></div>
                     <div className="skeleton skeleton-box"></div>
                  </div>
                ) : similarTrips.length > 0 ? (
                  <div className="grid grid-2">
                    {similarTrips.map((trip, idx) => (
                      <div key={idx} className="glass-panel">
                        <div className="badge badge-afternoon" style={{ marginBottom: '1rem' }}>{trip.type}</div>
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{trip.title}</h4>
                        <div style={{ fontWeight: 600, color: 'var(--accent-color)', marginBottom: '0.5rem' }}>📍 {trip.destination}</div>
                        <p style={{ fontSize: '0.95rem' }}>{trip.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No alternatives found right now.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
