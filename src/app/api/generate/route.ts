import { NextResponse } from 'next/server';
import Replicate from 'replicate';

// Configure for longer API timeout
export const maxDuration = 300; // 5 minutes
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
    );
  }

  const { prompt } = await request.json();

  const prediction = await replicate.predictions.create({
    version: "8beff3369e81422112d93b89ca01426147de542cd4684c244b673b105188fe5f",
    input: {
      prompt: prompt + ", comic book style, detailed, vibrant colors",
      negative_prompt: "low quality, bad anatomy, worst quality, low resolution",
      num_outputs: 4,
      guidance_scale: 7.5,
      num_inference_steps: 50,
    },
  });

  // Wait for the prediction to complete
  const finalPrediction = await replicate.wait(prediction);

  if (finalPrediction?.error) {
    return NextResponse.json({ detail: finalPrediction.error }, { status: 500 });
  }

  // Return the output array directly
  return NextResponse.json({ output: finalPrediction.output }, { status: 200 });
}

// Add a GET route to check the status of a prediction
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const predictionId = searchParams.get('id');

  if (!predictionId) {
    return NextResponse.json(
      { error: "Missing prediction ID" },
      { status: 400 }
    );
  }

  const prediction = await replicate.predictions.get(predictionId);

  if (prediction?.error) {
    return NextResponse.json({ detail: prediction.error }, { status: 500 });
  }

  return NextResponse.json(prediction);
}
