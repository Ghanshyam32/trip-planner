'use client';

import React, { useState, useEffect } from 'react';
import { TripRequest } from '@/types';

interface TripFormProps {
  onSubmit: (data: TripRequest) => void;
  isLoading: boolean;
  initialValues?: Partial<TripRequest>;
}

export default function TripForm({ onSubmit, isLoading, initialValues }: TripFormProps) {
  // Get tomorrow's date for default start
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultStart = tomorrow.toISOString().split('T')[0];
  
  // Get 3 days after tomorrow for default end
  const future = new Date(tomorrow);
  future.setDate(future.getDate() + 3);
  const defaultEnd = future.toISOString().split('T')[0];

  const [formData, setFormData] = useState<TripRequest>({
    source: '',
    destination: '',
    startDate: defaultStart,
    endDate: defaultEnd,
    budget: 50000,
    travelerType: 'Solo',
    vibe: 'Adventure',
    pace: 'Balanced',
    transport: 'Any',
    ...initialValues
  });

  const [budgetWarning, setBudgetWarning] = useState<string | null>(null);

  useEffect(() => {
    if (initialValues) {
      setFormData(prev => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'budget' ? Number(value) : value
    }));
    
    if (name === 'budget' || name === 'destination' || name === 'source') {
       setBudgetWarning(null); // Clear warning on change
    }
  };

  const checkBudgetValidation = () => {
    // Very basic heuristic for demo purposes
    const dest = formData.destination.toLowerCase();
    const source = formData.source.toLowerCase();
    const internationalKeywords = ['dubai', 'paris', 'bali', 'singapore', 'london', 'new york', 'tokyo'];
    
    const isInternational = internationalKeywords.some(kw => dest.includes(kw) || source.includes(kw));
    
    if (isInternational && formData.budget < 40000) {
      return "This budget may be too low for this international destination. Minimum recommended: ₹40,000.";
    }
    
    if (!isInternational && formData.budget < 5000) {
      return "This budget may be too low. Minimum recommended: ₹10,000.";
    }
    
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const warning = checkBudgetValidation();
    if (warning && !budgetWarning) {
      setBudgetWarning(warning);
      return; // Stop submission to show warning
    }

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

      <div className="grid grid-2">
        <div className="input-group">
          <label className="input-label" htmlFor="startDate">Start Date</label>
          <input
            className="input-field"
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            min={defaultStart}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="endDate">End Date</label>
          <input
            className="input-field"
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            min={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="input-group slider-container">
        <label className="input-label" htmlFor="budget">
          <span>Budget Range</span>
          <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>{formatINR(formData.budget)}</span>
        </label>
        <input
          className={`range-slider ${budgetWarning ? 'input-error' : ''}`}
          type="range"
          id="budget"
          name="budget"
          min="5000"
          max="200000"
          step="5000"
          value={formData.budget}
          onChange={handleChange}
          required
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          <span>₹5k</span>
          <span>₹2L+</span>
        </div>
        {budgetWarning && (
          <div style={{ color: '#ff4757', fontSize: '0.9rem', marginTop: '1rem', padding: '0.5rem', background: 'rgba(255, 71, 87, 0.1)', borderRadius: 'var(--radius-sm)' }}>
            ⚠️ {budgetWarning} Click 'Plan My Trip' again to proceed anyway.
          </div>
        )}
      </div>

      <div className="grid grid-2">
         <div className="input-group">
          <label className="input-label" htmlFor="travelerType">Traveler Type</label>
          <select
            className="input-field"
            id="travelerType"
            name="travelerType"
            value={formData.travelerType}
            onChange={handleChange}
            required
          >
            <option value="Solo">Solo</option>
            <option value="Couple">Couple</option>
            <option value="Family">Family</option>
            <option value="Friends Group">Friends Group</option>
          </select>
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="transport">Transport Preference</label>
          <select
            className="input-field"
            id="transport"
            name="transport"
            value={formData.transport}
            onChange={handleChange}
            required
          >
            <option value="Any">Any (Show all options)</option>
            <option value="Flight only">Flight only</option>
            <option value="Train/Bus only">Train/Bus only</option>
          </select>
        </div>
      </div>

      <div className="grid grid-2">
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
            <option value="Spiritual">Spiritual</option>
            <option value="Nightlife">Nightlife</option>
            <option value="Nature">Nature</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="pace">Pace Preference</label>
          <select
            className="input-field"
            id="pace"
            name="pace"
            value={formData.pace}
            onChange={handleChange}
            required
          >
            <option value="Relaxed">Relaxed</option>
            <option value="Balanced">Balanced</option>
            <option value="Packed">Packed</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Generating...' : (budgetWarning ? 'Proceed Anyway' : 'Plan My Trip')}
        </button>
      </div>
    </form>
  );
}
