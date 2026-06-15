// Gemini API client (server-side only)

import { GoogleGenerativeAI } from "@google/generative-ai";

let _genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!_genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }
    _genAI = new GoogleGenerativeAI(apiKey);
  }
  return _genAI;
}

export async function streamChatResponse(
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string
): Promise<ReadableStream<Uint8Array>> {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: systemPrompt,
  });

  // Convert messages to Gemini format
  const history = messages.slice(0, -1).map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const lastMessage = messages[messages.length - 1]?.content || "";

  const chat = model.startChat({ history });

  const result = await chat.sendMessageStream(lastMessage);

  // Convert Gemini stream to web ReadableStream
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(new TextEncoder().encode(text));
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

export async function generateTextResponse(
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    ...(systemPrompt && { systemInstruction: systemPrompt }),
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
}
