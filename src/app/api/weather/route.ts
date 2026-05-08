import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { destination, days } = await req.json();

    if (!destination || !days) {
      return NextResponse.json({ error: 'Destination and days are required' }, { status: 400 });
    }

    // 1. Geocode the destination
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination)}&count=1`);
    if (!geoRes.ok) throw new Error('Failed to geocode destination');
    const geoData = await geoRes.json();
    
    if (!geoData.results || geoData.results.length === 0) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    const { latitude, longitude } = geoData.results[0];

    // 2. Fetch weather forecast for the duration of the trip
    // Note: We use max 16 days as Open-Meteo limits free daily forecast range.
    const forecastDays = Math.min(days, 16);
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_mean&timezone=auto&forecast_days=${forecastDays}`);
    
    if (!weatherRes.ok) throw new Error('Failed to fetch weather forecast');
    const weatherData = await weatherRes.json();

    return NextResponse.json(weatherData.daily);
  } catch (error: any) {
    console.error('Weather API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch weather', details: error.message }, { status: 500 });
  }
}
