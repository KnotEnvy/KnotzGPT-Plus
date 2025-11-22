export const dynamic = 'force-dynamic';

import { auth } from "@clerk/nextjs/server"
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
        const { prompt } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!prompt) {
            return new NextResponse("Prompt is required", { status: 400 });
        }
        if (!process.env.HUGGING_FACE_ACCESS_TOKEN) {
            return new NextResponse("Hugging Face Access Token not Configured", { status: 500 });
        }

        const hf = new HfInference(process.env.HUGGING_FACE_ACCESS_TOKEN);

        const freeTrial = await checkApiLimit();
        const isPro = await checkSubscription()

        if (!freeTrial && !isPro) {
            return new NextResponse("Free trial has expired.", { status: 403 })
        }

        const response = await (hf as any).textToVideo({
            inputs: prompt,
            model: "cerspense/zeroscope_v2_576w",
        });

        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const video = `data:video/mp4;base64,${base64}`;

        if (!isPro) {
            await increaseApiLimit();
        }

        return NextResponse.json([video]);

    } catch (error) {
        console.log("[VIDEO_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
