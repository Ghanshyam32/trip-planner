import { POST } from '../route';

// Mock the GoogleGenAI module
jest.mock('@google/genai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => {
      return {
        models: {
          generateContent: jest.fn().mockResolvedValue({
            text: JSON.stringify({
              itinerary: [],
              costBreakdown: { transport: 0, stay: 0, food: 0, activities: 0, totalEstimated: 0, transportEstimates: {} },
              summary: 'Test summary',
              funFacts: ['Fact 1']
            })
          })
        }
      };
    })
  };
});

describe('API Route /api/plan', () => {
  it('returns 400 if required fields are missing', async () => {
    // Missing transport and pace, for example
    const requestObj = {
      json: async () => ({
        source: 'Delhi',
        destination: 'Goa',
        startDate: '2023-12-01',
        endDate: '2023-12-05',
        budget: 50000,
        travelerType: 'Solo',
        vibe: 'Relaxation'
      })
    } as unknown as Request;

    const response = await POST(requestObj);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.error).toBe('Missing required fields');
  });

  it('calls Gemini API and returns generated plan when valid data is provided', async () => {
    const requestObj = {
      json: async () => ({
        source: 'Delhi',
        destination: 'Goa',
        startDate: '2023-12-01',
        endDate: '2023-12-05',
        budget: 50000,
        travelerType: 'Solo',
        vibe: 'Relaxation',
        pace: 'Relaxed',
        transport: 'Flight only'
      })
    } as unknown as Request;

    const response = await POST(requestObj);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('itinerary');
    expect(data).toHaveProperty('costBreakdown');
    expect(data.summary).toBe('Test summary');
  });
});
