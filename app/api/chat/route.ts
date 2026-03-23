import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()
    const lastMessage = messages[messages.length - 1].content.toLowerCase()
    
    let reply = "I'm the AlignAI assistant. How can I help you with AI governance today?"
    
    if (lastMessage.includes('framework')) {
      reply = "The AlignAI framework provides structural controls for the AI decision environment — the layer where AI systems influence human choices."
    } else if (lastMessage.includes('assessment')) {
      reply = "Our AI Decision Visibility Assessment helps organizations understand what their AI is deciding before it impacts the business."
    } else if (lastMessage.includes('founder') || lastMessage.includes('brian')) {
      reply = "AlignAI was founded by Brian Burke, a PhD with 30 years of enterprise experience in AI architecture and governance."
    } else if (lastMessage.includes('price') || lastMessage.includes('cost')) {
      reply = "Please contact our strategic advisory team for a customized quote based on your organization's AI footprint."
    }

    return NextResponse.json({ reply })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 })
  }
}
