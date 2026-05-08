'use client';

import React, { useState } from 'react';
import TripForm from '@/components/TripForm';
import ItineraryDisplay from '@/components/ItineraryDisplay';
import CostBreakdown from '@/components/CostBreakdown';
import { TripPlan, TripRequest } from '@/types';

export default function Home() {
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePlan = async (request: TripRequest) => {
    setIsLoading(true);
    setError(null);
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
      
      // Validation to check if we actually got a plan back
      if (!data.itinerary || !data.costBreakdown) {
         throw new Error("Invalid response format from Gemini");
      }
      
      setPlan(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPlan = () => {
    setPlan(null);
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
        <div className="glass-panel animate-fade-in" style={{ backgroundColor: 'rgba(255, 0, 0, 0.1)', borderColor: 'rgba(255, 0, 0, 0.3)', marginBottom: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#ff6b6b', margin: 0 }}>{error}</p>
        </div>
      )}

      {!plan ? (
        <TripForm onSubmit={generatePlan} isLoading={isLoading} />
      ) : (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ margin: 0 }}>Your Custom Journey is Ready</h2>
            <button onClick={resetPlan} className="btn-secondary">
              ← Edit Preferences / Re-plan
            </button>
          </div>
          
          <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '2rem' }}>
            {/* The cost breakdown can sit at the top or side. Let's make a 2-column layout on large screens */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                 <div style={{ gridColumn: '1 / -1' }}>
                    <CostBreakdown costs={plan.costBreakdown} />
                 </div>
              </div>
              <ItineraryDisplay plan={plan} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
