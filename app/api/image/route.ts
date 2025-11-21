export const dynamic = 'force-dynamic';

import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { prompt, amount = 1, resolution = "512x512" } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!process.env.HUGGING_FACE_ACCESS_TOKEN) {
            return new NextResponse("Hugging Face Access Token not Configured", { status: 500 });
        }
        if (!prompt) {
            return new NextResponse("Prompt is required", { status: 400 });
        }
        if (!amount) {
            return new NextResponse("Amount is required", { status: 400 });
        }
        if (!resolution) {
            return new NextResponse("Resolution is required", { status: 400 });
        }

        const hf = new HfInference(process.env.HUGGING_FACE_ACCESS_TOKEN);

        const freeTrial = await checkApiLimit();
        const isPro = await checkSubscription()

        if (!freeTrial && !isPro) {
            return new NextResponse("Free trial has expired.", { status: 403 })
        }

        // Hugging Face free tier might have rate limits, so we do one by one or just one.
        // Also, textToImage returns a Blob. We need to convert to base64.
        // We'll generate 'amount' number of images.

        const images = [];
        for (let i = 0; i < parseInt(amount, 10); i++) {
            const response = await (hf as any).textToImage({
                inputs: prompt,
                model: "stabilityai/stable-diffusion-xl-base-1.0",
                parameters: {
                    negative_prompt: "blurry",
                }
            });

            const buffer = await response.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');
            const url = `data:image/png;base64,${base64}`;
            images.push({ url });
        }

        if (!isPro) {
            await increaseApiLimit();
        }

        return NextResponse.json(images);

    } catch (error) {
        console.log("[IMAGE_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
