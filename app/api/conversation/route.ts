export const dynamic = 'force-dynamic';

import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { personalities } from "@/lib/personalities";

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!process.env.GOOGLE_API_KEY) {
            return new NextResponse("Google API Key not Configured", { status: 500 });
        }
        if (!messages) {
            return new NextResponse("Messages are required", { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const content = personalities.cofounder;

        const freeTrial = await checkApiLimit();
        const isPro = await checkSubscription()

        if (!freeTrial && !isPro) {
            return new NextResponse("Free trial has expired.", { status: 403 })
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: content });

        // Convert messages to Gemini format if needed, or just use the last message prompt
        // Gemini chat history format: { role: "user" | "model", parts: [{ text: "..." }] }
        // OpenAI format: { role: "user" | "assistant" | "system", content: "..." }

        const chatHistory = messages.slice(0, -1).map((msg: any) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }]
        })).filter((msg: any) => msg.role !== "system"); // Filter out system messages as we use systemInstruction

        const lastMessage = messages[messages.length - 1];

        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessage(lastMessage.content);
        const response = result.response;
        const text = response.text();

        if (!isPro) {
            await increaseApiLimit();
        }

        // Return in OpenAI format for frontend compatibility
        return NextResponse.json({ role: "assistant", content: text });

    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
