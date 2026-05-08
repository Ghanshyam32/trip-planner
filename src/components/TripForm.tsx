'use client';

import React, { useState } from 'react';
import { TripRequest } from '@/types';

interface TripFormProps {
  onSubmit: (data: TripRequest) => void;
  isLoading: boolean;
}

export default function TripForm({ onSubmit, isLoading }: TripFormProps) {
  const [formData, setFormData] = useState<TripRequest>({
    source: '',
    destination: '',
    days: 3,
    budget: 50000,
    vibe: 'Adventure'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'days' || name === 'budget' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <h2 style={{ marginBottom: '2rem' }}>Design Your Journey</h2>
      
      <div className="grid grid-2">
        <div className="input-group">
          <label className="input-label" htmlFor="source">From</label>
          <input
            className="input-field"
            type="text"
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            placeholder="e.g. Mumbai"
            required
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="destination">To</label>
          <input
            className="input-field"
            type="text"
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="e.g. Bali"
            required
          />
        </div>
      </div>

      <div className="grid grid-3">
        <div className="input-group">
          <label className="input-label" htmlFor="days">Duration (Days)</label>
          <input
            className="input-field"
            type="number"
            id="days"
            name="days"
            min="1"
            max="30"
            value={formData.days}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="budget">Budget (INR)</label>
          <input
            className="input-field"
            type="number"
            id="budget"
            name="budget"
            min="1000"
            step="1000"
            value={formData.budget}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="vibe">Travel Vibe</label>
          <select
            className="input-field"
            id="vibe"
            name="vibe"
            value={formData.vibe}
            onChange={handleChange}
            required
          >
            <option value="Adventure">Adventure</option>
            <option value="Relaxation">Relaxation</option>
            <option value="Food & Culture">Food & Culture</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Crafting Itinerary...
            </>
          ) : (
            'Generate Plan'
          )}
        </button>
      </div>
    </form>
  );
}
