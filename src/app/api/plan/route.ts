import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// Initialize the Google Gen AI SDK
// It automatically picks up GEMINI_API_KEY from environment variables
const ai = new GoogleGenAI({});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { source, destination, days, budget, vibe } = body;

    if (!source || !destination || !days || !budget || !vibe) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const prompt = `
      You are a premium, expert travel planner. 
      Create a detailed, day-by-day itinerary and cost breakdown for the following trip:
      - From: ${source}
      - To: ${destination}
      - Duration: ${days} days
      - Budget: ₹${budget} INR
      - Preferred Vibe: ${vibe} (e.g., Adventure, Relaxation, Food & Culture, Mixed)

      Return the response ONLY as a valid JSON object with the exact following structure. Do not include markdown code blocks or any other text.
      {
        "itinerary": [
          {
            "day": 1,
            "theme": "Brief theme of the day",
            "activities": [
              { "time": "Morning", "description": "Activity details" },
              { "time": "Afternoon", "description": "Activity details" },
              { "time": "Evening", "description": "Activity details" }
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
        "summary": "A 2-3 sentence engaging summary of the trip highlighting why it perfectly matches the user's preferred vibe and budget."
      }
      
      Ensure the total estimated cost is within or reasonably close to the budget of ₹${budget} INR.
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
