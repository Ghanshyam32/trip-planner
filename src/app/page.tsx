'use client';

import React, { useState, useEffect } from 'react';
import { initAnalytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';
import Navbar from '@/components/Navbar';
import TripForm from '@/components/TripForm';
import ItineraryDisplay from '@/components/ItineraryDisplay';
import CostBreakdown from '@/components/CostBreakdown';
import PopularRoutes from '@/components/PopularRoutes';
import PackingList from '@/components/PackingList';
import BookingRedirects from '@/components/BookingRedirects';
import Toast from '@/components/Toast';
import { TripPlan, TripRequest, SimilarTrip, PackingList as PackingListType, WeatherData } from '@/types';

export default function Home() {
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [currentRequest, setCurrentRequest] = useState<TripRequest | null>(null);
  const [similarTrips, setSimilarTrips] = useState<SimilarTrip[]>([]);
  const [packingList, setPackingList] = useState<PackingListType | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSimilarLoading, setIsSimilarLoading] = useState(false);
  const [isPackingLoading, setIsPackingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [initialFormValues, setInitialFormValues] = useState<Partial<TripRequest>>({});
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    initAnalytics();
    const handleScroll = () => {
      if (plan && window.scrollY > 400) {
        setIsStickyVisible(true);
      } else {
        setIsStickyVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [plan]);

  const generatePlan = async (request: TripRequest) => {
    setIsLoading(true);
    setError(null);
    setPlan(null);
    setSimilarTrips([]);
    setPackingList(null);
    setWeatherData(null);
    setCurrentRequest(request);
    
    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || 'Failed to generate trip plan');
      }

      const data = await response.json();
      
      if (!data.itinerary || !data.costBreakdown) {
         throw new Error("Invalid response format from Gemini");
      }
      
      setPlan(data);
      
      // Fire off background tasks concurrently
      fetchSimilarTrips(request);
      fetchPackingList(request);
      fetchWeather(request);
      
      initAnalytics().then(analytics => {
        if (analytics) {
          logEvent(analytics, 'trip_planned', { destination: request.destination, budget: request.budget });
        }
      });
      
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDays = (startStr: string, endStr: string) => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  };

  const fetchWeather = async (request: TripRequest) => {
    try {
      const days = calculateDays(request.startDate, request.endDate);
      const response = await fetch('/api/weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: request.destination,
          days: days
        })
      });

      if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
      }
    } catch (err) {
      console.error("Failed to fetch weather", err);
    }
  };

  const fetchSimilarTrips = async (request: TripRequest) => {
    setIsSimilarLoading(true);
    try {
      const days = calculateDays(request.startDate, request.endDate);
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

  const fetchPackingList = async (request: TripRequest) => {
    setIsPackingLoading(true);
    try {
      const days = calculateDays(request.startDate, request.endDate);
      const response = await fetch('/api/packing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: request.destination,
          days: days,
          vibe: request.vibe,
          travelerType: request.travelerType
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.categories) {
          setPackingList(data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch packing list", err);
    } finally {
      setIsPackingLoading(false);
    }
  };

  const resetPlan = () => {
    const formElement = document.getElementById('form');
    if (formElement) {
      const y = formElement.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRouteSelect = (route: Partial<TripRequest>) => {
    setInitialFormValues(route);
    
    // Show toast and scroll to form smoothly
    setToastMessage("Route pre-filled! Adjust and plan your trip.");
    const formElement = document.getElementById('form');
    if (formElement) {
      const y = formElement.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleSimilarTripSelect = (trip: SimilarTrip) => {
    if (!currentRequest) return;
    
    const newRequest: TripRequest = {
      ...currentRequest,
      destination: trip.destination,
      budget: trip.budget 
    };
    
    setInitialFormValues(newRequest);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    generatePlan(newRequest);
  };

  return (
    <>
      <Navbar />
      
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      <div className={`sticky-summary ${isStickyVisible ? 'visible' : ''}`}>
        <div className="sticky-details">
           <span>{currentRequest?.source} ✈️ {currentRequest?.destination}</span>
           <span style={{ color: 'var(--text-secondary)' }}>•</span>
           <span>₹{currentRequest?.budget.toLocaleString('en-IN')}</span>
        </div>
        <button onClick={resetPlan} className="btn-secondary" aria-label="Edit Preferences or Re-plan" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
          Edit Preferences
        </button>
      </div>

      <main className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }} className="animate-fade-in">
          <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(138, 43, 226, 0.1)', borderRadius: '20px', color: 'var(--accent-color)', fontWeight: 600, marginBottom: '1rem', fontSize: '0.9rem' }}>
            <span style={{ display: 'inline-block', animation: 'fadeIn 2s infinite alternate', marginRight: '0.5rem' }}>✈️</span>
            Your AI Travel Concierge
          </div>
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
            <p>Analyzing routes, checking the forecast, and optimizing your budget.</p>
          </div>
        ) : !plan ? (
          <>
            <div id="routes">
              <PopularRoutes onSelect={handleRouteSelect} />
            </div>
            <div id="form">
              <TripForm onSubmit={generatePlan} isLoading={false} initialValues={initialFormValues} />
            </div>
          </>
        ) : (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ margin: 0 }}>Your Custom Journey is Ready</h2>
              <button onClick={resetPlan} className="btn-secondary" aria-label="Edit Preferences or Re-plan">
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

                <ItineraryDisplay 
                  plan={plan} 
                  isLoading={false} 
                  destination={currentRequest!.destination}
                  totalBudget={currentRequest!.budget}
                  days={calculateDays(currentRequest!.startDate, currentRequest!.endDate)}
                  weatherData={weatherData}
                />
                
                <BookingRedirects request={currentRequest!} />
                
                <PackingList packingList={packingList} isLoading={isPackingLoading} />
                
                {/* Similar Trips Section */}
                <div style={{ marginTop: '3rem' }}>
                  <h3 className="gradient-text" style={{ marginBottom: '1.5rem' }}>Alternative Ideas</h3>
                  {isSimilarLoading ? (
                    <div className="grid grid-2">
                       <div className="skeleton skeleton-box" style={{ height: '250px' }}></div>
                       <div className="skeleton skeleton-box" style={{ height: '250px' }}></div>
                    </div>
                  ) : similarTrips.length > 0 ? (
                    <div className="grid grid-2">
                      {similarTrips.map((trip, idx) => (
                        <div key={idx} className="image-card" style={{ minHeight: '300px' }}>
                          <div 
                            className="image-card-bg"
                            role="img"
                            aria-label={`Photo of ${trip.destination}`}
                            style={{ backgroundImage: `url(https://picsum.photos/seed/${trip.destination.toLowerCase()}/400/300)` }}
                          />
                          <div className="image-card-overlay" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.9) 100%)' }} />
                          
                          <div className="image-card-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                            <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
                              {trip.type}
                            </div>
                            
                            <div>
                              <h4 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', color: 'white' }}>{trip.title}</h4>
                              <div style={{ fontWeight: 600, color: '#ff007f', marginBottom: '0.5rem' }}>📍 {trip.destination}</div>
                              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', marginBottom: '1rem' }}>{trip.description}</p>
                              <button 
                                onClick={() => handleSimilarTripSelect(trip)}
                                className="btn-primary" 
                                aria-label={`Plan a trip to ${trip.destination}`}
                                style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem' }}
                              >
                                Plan This Trip • ₹{trip.budget.toLocaleString('en-IN')}
                              </button>
                            </div>
                          </div>
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
    </>
  );
}
