'use client';

import React, { useState } from 'react';
import { PackingList as PackingListType } from '@/types';

interface PackingListProps {
  packingList: PackingListType | null;
  isLoading: boolean;
}

export default function PackingList({ packingList, isLoading }: PackingListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (category: string, item: string) => {
    const key = `${category}-${item}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (isLoading) {
    return (
      <div className="glass-panel animate-fade-in" style={{ marginTop: '2rem' }}>
         <div className="skeleton skeleton-title" style={{ width: '30%' }}></div>
         <div className="skeleton skeleton-text"></div>
         <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
      </div>
    );
  }

  if (!packingList) return null;

  return (
    <div className="glass-panel animate-fade-in" style={{ marginTop: '2rem', padding: 0, overflow: 'hidden' }}>
      <div 
        className="accordion-header" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ background: 'var(--panel-bg)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🧳</span>
          <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Smart Packing Checklist</h3>
        </div>
        <div style={{ fontSize: '1.5rem', transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
          ▼
        </div>
      </div>
      
      <div className={`accordion-content ${isOpen ? 'expanded' : ''}`}>
        <div className="accordion-inner">
          <div style={{ padding: '1.5rem 2rem' }}>
            <div className="grid grid-2">
              {packingList.categories.map((cat, idx) => (
                <div key={idx} style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--accent-color)', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                    {cat.category}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {cat.items.map((item, i) => {
                      const key = `${cat.category}-${item}`;
                      const isChecked = !!checkedItems[key];
                      return (
                        <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            className="custom-checkbox"
                            checked={isChecked}
                            onChange={() => toggleItem(cat.category, item)}
                          />
                          <span style={{ 
                            fontSize: '0.95rem', 
                            color: isChecked ? 'var(--text-secondary)' : 'var(--text-primary)',
                            textDecoration: isChecked ? 'line-through' : 'none',
                            transition: 'all 0.2s ease'
                          }}>
                            {item}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
