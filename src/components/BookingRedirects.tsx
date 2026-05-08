'use client';

import React from 'react';
import { TripRequest } from '@/types';

interface BookingRedirectsProps {
  request: TripRequest;
}

export default function BookingRedirects({ request }: BookingRedirectsProps) {
  // Format Date for MMT Flights: DDMMYYYY
  const formatFlightDate = (dateString: string) => {
    const d = new Date(dateString);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}${month}${year}`;
  };

  const encodedSource = encodeURIComponent(request.source);
  const encodedDest = encodeURIComponent(request.destination);
  const flightDate = formatFlightDate(request.startDate);

  const mmtFlightUrl = `https://www.makemytrip.com/flight/search?itinerary=${encodedSource}-${encodedDest}-${flightDate}&tripType=O&paxType=A-1_C-0_I-0&intl=false&cabinClass=E`;
  const mmtHotelUrl = `https://www.makemytrip.com/hotels/hotel-listing/?city=${encodedDest}&checkin=${request.startDate}&checkout=${request.endDate}&roomCount=1&adultsCount=1`;
  const irctcUrl = `https://www.irctc.co.in/nget/train-search`;

  return (
    <div className="glass-panel animate-fade-in" style={{ marginTop: '2rem', textAlign: 'center' }}>
      <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Ready to Book?</h3>
      <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
        Compare real-time prices and secure your reservations.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a 
          href={mmtFlightUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-primary"
          aria-label="Search Flights on MakeMyTrip"
          style={{ background: 'linear-gradient(135deg, #1A73E8 0%, #0052B4 100%)', flex: '1 1 200px' }}
        >
          ✈️ Search Flights
        </a>
        <a 
          href={mmtHotelUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-primary"
          aria-label="Search Hotels on MakeMyTrip"
          style={{ background: 'linear-gradient(135deg, #E65100 0%, #BF360C 100%)', flex: '1 1 200px' }}
        >
          🏨 Search Hotels
        </a>
        <a 
          href={irctcUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-primary"
          aria-label="Search Trains on IRCTC"
          style={{ background: 'linear-gradient(135deg, #00695C 0%, #004D40 100%)', flex: '1 1 200px' }}
        >
          🚆 Search Trains
        </a>
      </div>
      
      <p style={{ fontSize: '0.8rem', marginTop: '1.5rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
        *Redirects to partner sites for real-time pricing and availability. Flight routes may require exact airport codes on MMT.
      </p>
    </div>
  );
}
