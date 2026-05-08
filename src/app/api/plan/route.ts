import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { source, destination, startDate, endDate, budget, travelerType, vibe, pace } = body;

    if (!source || !destination || !startDate || !endDate || !budget || !travelerType || !vibe || !pace) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    const prompt = `
      You are a premium, expert travel planner building a production-grade itinerary. 
      Create a highly detailed, day-by-day itinerary and cost breakdown for the following trip:
      - From: ${source}
      - To: ${destination}
      - Dates: ${startDate} to ${endDate} (${days} days)
      - Traveler Type: ${travelerType} (Keep this in mind for all recommendations. E.g., Family gets kid-friendly, Solo gets budget/social, Couple gets romantic)
      - Budget: ₹${budget} INR (Ensure total cost breakdown accurately reflects this budget)
      - Preferred Vibe: ${vibe}
      - Pace Preference: ${pace} (If Relaxed, fewer activities. If Packed, full days.)

      Return the response ONLY as a valid JSON object with the EXACT following structure. Do not include markdown code blocks or any other text.
      {
        "itinerary": [
          {
            "day": 1,
            "theme": "Brief theme of the day",
            "localSecret": "One highly specific local secret or hidden gem for the day that tourists miss",
            "activities": [
              { 
                "time": "Morning", 
                "name": "Activity Name",
                "description": "Activity details including why it fits the traveler type and vibe",
                "estimatedCostINR": 500,
                "duration": "2 hours",
                "proTip": "A useful pro tip for this specific activity"
              },
              { 
                "time": "Afternoon", 
                "name": "Activity Name",
                "description": "Activity details including why it fits the traveler type and vibe",
                "estimatedCostINR": 1000,
                "duration": "3 hours",
                "proTip": "A useful pro tip for this specific activity"
              },
              { 
                "time": "Evening", 
                "name": "Activity Name",
                "description": "Activity details including why it fits the traveler type and vibe",
                "estimatedCostINR": 1500,
                "duration": "2.5 hours",
                "proTip": "A useful pro tip for this specific activity"
              }
            ]
          }
        ],
        "costBreakdown": {
          "transport": 0,
          "stay": 0,
          "food": 0,
          "activities": 0,
          "totalEstimated": 0
        },
        "summary": "A 2-3 sentence engaging summary of the trip highlighting why it perfectly matches the traveler type, vibe, and budget."
      }
      
      CRITICAL INSTRUCTIONS:
      - Every single day must have exactly one "Morning", one "Afternoon", and one "Evening" activity slot.
      - Make sure "hidden gems" are prioritized over standard tourist traps.
      - Ensure the "totalEstimated" closely aligns with the budget of ₹${budget} INR.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const resultText = response.text;
    if (!resultText) {
       throw new Error("No response text from Gemini");
    }

    const data = JSON.parse(resultText);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error generating trip plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate trip plan', details: error.message },
      { status: 500 }
    );
  }
}
