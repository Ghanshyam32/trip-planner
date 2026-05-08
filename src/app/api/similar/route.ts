import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { source, destination, budget, days, vibe } = body;

    if (!source || !destination || !budget || !days || !vibe) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const prompt = `
      You are an expert travel recommender.
      The user just planned a trip from ${source} to ${destination} for ${days} days with a budget of ₹${budget} INR and a ${vibe} vibe.
      
      Generate two alternative trip ideas:
      1. "Stretch your budget": Assume a 30% higher budget (approx ₹${Math.floor(budget * 1.3)}), same dates, but suggest a more premium or exotic destination.
      2. "Similar vibe": A completely different destination that offers the exact same ${vibe} vibe, for the exact same budget of ₹${budget} and ${days} days.

      Return the response ONLY as a valid JSON object with the EXACT following structure:
      {
        "similarTrips": [
          {
            "type": "Stretch your budget",
            "title": "A catchy title for the trip",
            "destination": "New Destination Name",
            "description": "Why this is a great upgrade and what they can do.",
            "budget": 0
          },
          {
            "type": "Similar vibe",
            "title": "A catchy title for the trip",
            "destination": "New Destination Name",
            "description": "Why this destination perfectly matches their preferred vibe.",
            "budget": 0
          }
        ]
      }
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
    console.error('Error generating similar trips:', error);
    return NextResponse.json(
      { error: 'Failed to generate similar trips', details: error.message },
      { status: 500 }
    );
  }
}
