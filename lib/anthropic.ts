interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are an AI governance advisor for AlignAI by ByteStream Strategies. You answer questions about:
- The AlignAI governance framework (five pillars: Transparency, Accountability, Compliance, Risk Management, Continuous Monitoring)
- The AI Decision Visibility Assessment
- Enterprise AI governance best practices
- Regulatory compliance (EU AI Act, NIST AI RMF)

Be concise, professional, and helpful. If a question is outside your scope, politely redirect to contacting the team directly.`;

export async function sendChatMessage(
  messages: ChatMessage[],
  apiKey: string
): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const textBlock = data.content?.find(
    (block: { type: string }) => block.type === "text"
  );
  return textBlock?.text ?? "I could not generate a response.";
}
