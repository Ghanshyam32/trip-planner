'use client';

import React from 'react';
import { CostBreakdown as CostBreakdownType } from '@/types';

interface CostBreakdownProps {
  costs: CostBreakdownType;
}

export default function CostBreakdown({ costs }: CostBreakdownProps) {
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const categories = [
    { label: 'Transport', value: costs.transport, icon: '✈️' },
    { label: 'Accommodation', value: costs.stay, icon: '🏨' },
    { label: 'Food & Dining', value: costs.food, icon: '🍽️' },
    { label: 'Activities', value: costs.activities, icon: '🎟️' }
  ];

  return (
    <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.6s', height: '100%' }}>
      <h3 className="gradient-text" style={{ marginBottom: '1.5rem' }}>Estimated Costs</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {categories.map((cat, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{cat.label}</span>
            </div>
            <span style={{ fontWeight: 600 }}>{formatINR(cat.value)}</span>
          </div>
        ))}
      </div>

      <div style={{ 
        borderTop: '1px solid var(--panel-border)', 
        paddingTop: '1.5rem',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Total Estimate</span>
        <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent-color)' }}>
          {formatINR(costs.totalEstimated)}
        </span>
      </div>
    </div>
  );
}
