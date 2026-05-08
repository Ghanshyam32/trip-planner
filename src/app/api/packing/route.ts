import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { destination, days, vibe, travelerType } = body;

    if (!destination || !days || !vibe || !travelerType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const prompt = `
      You are an expert travel assistant. The user is traveling to ${destination} for ${days} days.
      The trip vibe is ${vibe} and the traveler type is ${travelerType}.
      
      Generate a smart packing list specific to this destination and trip style. Consider the likely weather/season for this location.
      Return the response ONLY as a valid JSON object with the EXACT following structure:
      {
        "categories": [
          {
            "category": "Documents",
            "items": ["Passport", "Visa (if required)", "..."]
          },
          {
            "category": "Clothing",
            "items": ["Item 1", "Item 2"]
          },
          {
            "category": "Essentials",
            "items": ["Item 1"]
          },
          {
            "category": "Activities Specific Gear",
            "items": ["Item 1"]
          }
        ]
      }
      Do not include markdown blocks around the JSON.
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
    console.error('Error generating packing list:', error);
    return NextResponse.json(
      { error: 'Failed to generate packing list', details: error.message },
      { status: 500 }
    );
  }
}
