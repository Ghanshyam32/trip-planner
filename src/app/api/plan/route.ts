import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
export const revalidate = 0;
export const dynamic = "force-dynamic";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const sanitize = (str: string) => str.replace(/[<>]/g, "").trim().slice(0, 100);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      source,
      destination,
      startDate,
      endDate,
      budget,
      travelerType,
      vibe,
      pace,
      transport,
    } = body;

    if (
      !source ||
      !destination ||
      !startDate ||
      !endDate ||
      !budget ||
      !travelerType ||
      !vibe ||
      !pace ||
      !transport
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const safeSource = sanitize(source);
    const safeDestination = sanitize(destination);

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.max(
      1,
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1,
    );

    const prompt = `
      You are a premium, expert travel planner building a production-grade itinerary. 
      Create a highly detailed, day-by-day itinerary and cost breakdown for the following trip:
      - From: ${safeSource}
      - To: ${safeDestination}
      - Dates: ${startDate} to ${endDate} (${days} days)
      - Traveler Type: ${travelerType}
      - Budget: ₹${budget} INR
      - Preferred Vibe: ${vibe}
      - Pace Preference: ${pace}
      - Transport Preference: ${transport}

      Return the response ONLY as a valid JSON object with the EXACT following structure. Do not include markdown code blocks or any other text.
      {
        "itinerary": [
          {
            "day": 1,
            "theme": "Brief theme of the day",
            "localSecret": "One highly specific local secret or hidden gem for the day that tourists miss",
            "hotelRanges": {
              "budget": "₹X - ₹Y",
              "midRange": "₹X - ₹Y",
              "luxury": "₹X - ₹Y"
            },
            "activities": [
              { 
                "time": "Morning", 
                "name": "Activity Name",
                "description": "Activity details",
                "estimatedCostINR": 500,
                "duration": "2 hours",
                "proTip": "A useful pro tip"
              },
              { 
                "time": "Afternoon", 
                "name": "Activity Name",
                "description": "Activity details",
                "estimatedCostINR": 1000,
                "duration": "3 hours",
                "proTip": "A useful pro tip"
              },
              { 
                "time": "Evening", 
                "name": "Activity Name",
                "description": "Activity details",
                "estimatedCostINR": 1500,
                "duration": "2.5 hours",
                "proTip": "A useful pro tip"
              }
            ]
          }
        ],
        "costBreakdown": {
          "transport": 0,
          "stay": 0,
          "food": 0,
          "activities": 0,
          "totalEstimated": 0,
          "transportEstimates": {
             "flight": "₹X - ₹Y",
             "trainBus": "₹X - ₹Y (Leave empty or null if destination is international and impossible to reach by train/bus)"
          }
        },
        "summary": "A 2-3 sentence engaging summary of the trip highlighting why it perfectly matches the traveler type, vibe, and budget.",
        "funFacts": [
          "Fun fact 1 about the destination",
          "Fun fact 2 about the destination",
          "Fun fact 3 about the destination"
        ]
      }
      
      CRITICAL INSTRUCTIONS:
      - Ensure the "totalEstimated" closely aligns with the budget of ₹${budget} INR.
      - Take the transport preference (${transport}) into account when calculating the "transport" cost in the breakdown.
      - If the destination is international from the source, only provide flight estimates.
    `;

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), 25000),
    );

    const response = (await Promise.race([
      ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      }),
      timeoutPromise,
    ])) as any;

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response text from Gemini");
    }

    const data = JSON.parse(resultText);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error generating trip plan:", error);
    return NextResponse.json(
      { error: "Failed to generate trip plan", details: error.message },
      { status: 500 },
    );
  }
}
