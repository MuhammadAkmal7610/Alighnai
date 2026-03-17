import { prisma } from '../lib/prisma'
import { ContentStatus, ContentType, InfoType } from '@prisma/client'

async function main() {
  console.log('Seeding CMS data...')

  // 1. Home Page Info (Settings/General)
  await prisma.info.upsert({
    where: { type: InfoType.SETTINGS },
    update: {},
    create: {
      type: InfoType.SETTINGS,
      title: 'Home Page Content',
      content: 'General settings and homepage data',
      metadata: {
        hero: {
          kicker: 'Enterprise AI Governance Architecture',
          title: 'AI is already influencing decisions in your organization.',
          highlight: 'Most enterprises have no governance over that layer.',
          description: 'AlignAI governs the AI Decision Influence Layer — the environment created by AI systems before humans make decisions. Built for enterprise. Grounded in doctoral research.'
        },
        problems: [
          {
            title: "The Decision Influence Layer",
            description: "Before your teams make any decision, AI has already shaped what information they see. That layer is entirely ungoverned in most enterprises."
          },
          {
            title: "Governance Without Architecture",
            description: "Most organizations have AI policies, not AI governance architecture. Policy tells people what is allowed. Architecture defines ownership and accountability."
          },
          {
            title: "Regulatory Exposure Is Accelerating",
            description: "DSFI, BO, Fair Housing algorithmic screening, the EU AI Act, and casemark doctrine are converging on AI decision accountability."
          },
          {
            title: "The Entry Point Is Visibility",
            description: "You cannot govern what you cannot see. The first step is mapping where AI is influencing decisions across your enterprise."
          }
        ],
        credentials: [
          "PhD - Carleton University",
          "MBA - University of Ottawa",
          "PMP Certified",
          "30+ Years Enterprise"
        ]
      }
    }
  })

  // 2. About Page Info
  await prisma.info.upsert({
    where: { type: InfoType.ABOUT },
    update: {},
    create: {
      type: InfoType.ABOUT,
      title: 'About AlignAI',
      content: 'Brian Burke holds a PhD in Organizational and Systems Perspective from Carleton University...',
      metadata: {
        founder: {
          name: 'Brian Burke',
          title: 'AI Governance Architect · Founder, ByteStream Strategies Inc.',
          credentials: ["PhD", "MBA", "PMP", "30+ Years Enterprise"],
          bio: [
            "Brian Burke holds a PhD in Organizational and Systems Perspective from Carleton University, an MBA in Enterprise Governance and Strategy from the University of Ottawa, and is a certified Project Management Professional. He has more than 30 years of enterprise consulting experience.",
            "His doctoral research examined the governance gap in how enterprises deploy large language models, specifically, the absence of structural controls over the AI Decision Influence Layer. AlignAI is the proprietary governance architecture framework developed from that research.",
            "ByteStream Strategies Inc. is the consulting entity through which the AlignAI framework is delivered. Brian works with enterprise leadership teams in real estate, financial services, and adjacent sectors."
          ],
          linkedin: "https://www.linkedin.com/",
          email: "bburke@bytestream.ca"
        }
      }
    }
  })

  // 3. Contact Info
  await prisma.info.upsert({
    where: { type: InfoType.CONTACT },
    update: {},
    create: {
      type: InfoType.CONTACT,
      title: 'Contact Information',
      content: 'Direct conversation for enterprise AI governance fit.',
      metadata: {
        email: "bburke@bytestream.ca",
        linkedin: "https://www.linkedin.com/",
        description: "No forms, no demos, no sales calls. A direct conversation about whether there is a fit.",
        subtext: "If you are working on AI governance architecture - or trying to understand whether you should be - this is the conversation to have. Reach out directly. No intake form, no scheduling tool, no SDR."
      }
    }
  })

  // 4. Framework Page
  await prisma.page.upsert({
    where: { slug: 'framework' },
    update: {},
    create: {
      title: 'AlignAI Governance Framework',
      slug: 'framework',
      status: ContentStatus.PUBLISHED,
      content: 'Governance architecture for the layer most frameworks miss.',
      metadata: {
        hero: {
          kicker: 'The Framework',
          title: 'Governance architecture for the layer most frameworks miss.',
          description: 'AlignAI defines the structural controls for the AI decision environment your organization has already created - but policies, not coherent architecture.'
        },
        pillars: [
          { number: "01", title: "Strategic Alignment", description: "Ensure AI initiatives operate within enterprise strategy. Establish governance authority, investment gating, and executive ownership over the AI decision environment." },
          { number: "02", title: "Decision Visibility", description: "Map every location where AI systems influence operational decisions before humans act. Build the decision influence register your organization does not have yet." },
          { number: "03", title: "Risk Classification", description: "Establish governance tiers based on operational and regulatory exposure. Not every AI touchpoint requires the same level of control, but every one requires classification." },
          { number: "04", title: "Oversight Structures", description: "Define the monitoring, review cadence, override paths, and evidence requirements for each AI-influenced decision domain." },
          { number: "05", title: "Executive Accountability", description: "Assign named ownership for every AI-influenced decision domain. Leadership must be able to answer: who is responsible when AI-influenced decision causes harm?" }
        ],
        modelLayers: [
          { label: "Foundation", title: "Enterprise Operations" },
          { label: "Layer 2", title: "AI Systems (Yardi, Copilot, LLMs, etc.)" },
          { label: "The Gap", title: "AI Decision Influence Layer" },
          { label: "AlignAI", title: "Governance Architecture" },
          { label: "Outcome", title: "Responsible AI Adoption" }
        ]
      }
    }
  })

  console.log('Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
