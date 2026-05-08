export interface Activity {
  time: string;
  description: string;
}

export interface DayItinerary {
  day: number;
  theme: string;
  activities: Activity[];
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
  days: number;
  budget: number;
  vibe: string;
}
