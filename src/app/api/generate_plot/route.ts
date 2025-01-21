import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
    baseURL: "https://models.inference.ai.azure.com",
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("The OPENAI_API_KEY environment variable is not set.");
  }

  try {
    const { prompt } = await request.json();

    const systemPrompt = `
      Create a 3-panel comic story about delts' adventure. For each panel, provide:
      1. An image generation prompt that includes 'delts' and ends with 'cartoonish style, warm colors'
      2. A caption that refers to the person as 'Andy'

      Format the output as JSON with this structure:
      {
        "comics": [
          {
            "prompt": "Image generation prompt here",
            "caption": "Caption text here"
          }
        ]
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ]
    });

    // Parse and validate the response
    if (!completion.choices[0].message.content) {
      throw new Error('No content in OpenAI response');
    }

    const storyJson = JSON.parse(completion.choices[0].message.content);
    return NextResponse.json(storyJson);

  } catch (error) {
    console.error('Error generating story:', error);
    return NextResponse.json(
      { error: 'Failed to generate story' },
      { status: 500 }
    );
  }
}
