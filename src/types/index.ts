export interface Activity {
  time: string; // "Morning", "Afternoon", "Evening"
  name: string;
  description: string;
  estimatedCostINR: number;
  duration: string;
  proTip: string;
}

export interface HotelRanges {
  budget: string;
  midRange: string;
  luxury: string;
}

export interface DayItinerary {
  day: number;
  theme: string;
  activities: Activity[];
  localSecret: string;
  hotelRanges: HotelRanges;
}

export interface TransportEstimates {
  flight?: string;
  trainBus?: string;
}

export interface CostBreakdown {
  transport: number;
  stay: number;
  food: number;
  activities: number;
  totalEstimated: number;
  transportEstimates: TransportEstimates;
}

export interface TripPlan {
  itinerary: DayItinerary[];
  costBreakdown: CostBreakdown;
  summary: string;
}

export interface TripRequest {
  source: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelerType: string;
  vibe: string;
  pace: string;
  transport: string;
}

export interface SimilarTrip {
  type: string; // "Stretch your budget" | "Similar vibe"
  title: string;
  destination: string;
  description: string;
  budget: number;
}
