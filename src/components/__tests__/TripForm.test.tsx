import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TripForm from '../TripForm';

describe('TripForm Component', () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default values', () => {
    render(<TripForm onSubmit={mockSubmit} isLoading={false} />);
    
    // Check if form title is present
    expect(screen.getByText('Design Your Journey')).toBeInTheDocument();
    
    // Check if source and destination inputs are present
    expect(screen.getByPlaceholderText('e.g. Mumbai')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Bali')).toBeInTheDocument();
    
    // Check if submit button is present
    expect(screen.getByRole('button', { name: /Submit trip plan request/i })).toBeInTheDocument();
  });

  it('calls onSubmit with form data when submitted', () => {
    render(<TripForm onSubmit={mockSubmit} isLoading={false} />);
    
    const sourceInput = screen.getByLabelText(/From/i);
    const destInput = screen.getByLabelText(/To/i);
    const submitBtn = screen.getByRole('button', { name: /Submit trip plan request/i });
    
    // Fill out required fields
    fireEvent.change(sourceInput, { target: { value: 'Delhi' } });
    fireEvent.change(destInput, { target: { value: 'Goa' } });
    
    fireEvent.click(submitBtn);
    
    // Verify onSubmit was called
    expect(mockSubmit).toHaveBeenCalledTimes(1);
    
    // Verify the arguments passed to onSubmit
    const submittedData = mockSubmit.mock.calls[0][0];
    expect(submittedData.source).toBe('Delhi');
    expect(submittedData.destination).toBe('Goa');
    expect(submittedData.budget).toBe(50000); // Default budget
  });

  it('shows warning when budget is too low for international destination', () => {
    render(<TripForm onSubmit={mockSubmit} isLoading={false} />);
    
    const sourceInput = screen.getByLabelText(/From/i);
    const destInput = screen.getByLabelText(/To/i);
    const budgetInput = screen.getByLabelText(/Budget Range/i);
    const submitBtn = screen.getByRole('button', { name: /Submit trip plan request/i });
    
    fireEvent.change(sourceInput, { target: { value: 'Delhi' } });
    fireEvent.change(destInput, { target: { value: 'Dubai' } }); // International destination
    fireEvent.change(budgetInput, { target: { value: '10000' } }); // Low budget
    
    fireEvent.click(submitBtn);
    
    // Should show warning instead of submitting immediately
    expect(mockSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/This budget may be too low for this international destination/i)).toBeInTheDocument();
    
    // Clicking again should bypass warning
    fireEvent.click(submitBtn);
    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });
});
