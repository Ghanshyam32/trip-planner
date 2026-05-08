export interface Activity {
  time: string; // "Morning", "Afternoon", "Evening"
  name: string;
  description: string;
  estimatedCostINR: number;
  duration: string;
  proTip: string;
}

export interface DayItinerary {
  day: number;
  theme: string;
  activities: Activity[];
  localSecret: string;
}

export interface CostBreakdown {
  transport: number;
  stay: number;
  food: number;
  activities: number;
  totalEstimated: number;
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
}
