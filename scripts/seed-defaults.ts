
import 'dotenv/config';
import { prisma } from '../lib/prisma';
import { InfoType } from '@prisma/client';

async function main() {
  try {
    // Seed Home Page Metadata
    const homeDefaults = {
      seoTitle: 'Enterprise AI Governance & Strategy',
      seoDescription:
        'AlignAI by ByteStream Strategies helps enterprises deploy AI responsibly with governance frameworks, decision visibility, and strategic advisory.',
      hero: {
        kicker: 'Enterprise AI Governance Architecture',
        title: 'AI is already influencing decisions in your organization.',
        highlight: 'Most enterprises have no governance over that layer.',
        description: 'ByteStream Strategies helps enterprise leaders build the governance architecture that traditional AI frameworks miss.'
      },
      problems: [
        { title: 'Decision Invisibility', description: 'AI systems are already making or influencing decisions across your organization with zero oversight.' },
        { title: 'Governance Gaps', description: 'Traditional frameworks focus on the model, not the decision environment it creates.' },
        { title: 'Model-Centric Blindness', description: 'NIST and ISO focus on training data, missing where AI actually changes enterprise behavior.' },
        { title: 'Regulatory Exposure', description: 'Without a decision influence map, accountability under the EU AI Act is impossible to document.' }
      ],
      gapKicker: 'THE GOVERNANCE GAP',
      gapTitle: 'Every major AI governance framework is focused on the wrong layer.',
      gapDescription:
        '<p>NIST, ISO 42001, and the EU AI Act focus on models, training data, and compliance outputs. They do not govern where AI actually changes enterprise behavior.</p>',
      credentials: ["PHD - CARLETON UNIVERSITY", "MBA - UNIVERSITY OF OTTAWA", "PMP CERTIFIED", "30+ YEARS ENTERPRISE"]
    };

    await prisma.page.upsert({
      where: { slug: 'home' },
      update: { metadata: homeDefaults },
      create: { 
        title: 'Home', 
        slug: 'home', 
        content: 'Home page content', 
        metadata: homeDefaults,
        status: 'PUBLISHED',
        template: 'default'
      }
    });
    console.log('Seeded Home Page metadata.');

    // Seed About Page Metadata
    const aboutDefaults = {
      seoTitle: 'About AlignAI',
      seoDescription:
        'Learn about AlignAI by ByteStream Strategies — our mission, expertise, and commitment to responsible enterprise AI governance.',
      hero: {
        kicker: 'The Founder',
        title: 'Built from doctoral research.',
        highlight: 'Delivered with 30 years of enterprise experience.',
        description: 'Brian Burke, PhD, MBA, PMP — AI Governance Architect and founder of ByteStream Strategies.'
      },
      founder: {
        name: 'Brian Burke',
        title: 'AI Governance Architect · Founder, ByteStream Strategies Inc.',
        credentials: ["PHD - CARLETON UNIVERSITY", "MBA - UNIVERSITY OF OTTAWA", "PMP CERTIFIED", "30+ YEARS ENTERPRISE"],
        bio: [
          "Brian Burke holds a PhD in Organizational and Systems Perspective from Carleton University, an MBA in Enterprise Governance and Strategy from the University of Ottawa, and is a certified Project Management Professional. He has more than 30 years of enterprise consulting experience.",
          "His doctoral research examined the governance gap in how enterprises deploy large language models, specifically, the absence of structural controls over the AI Decision Influence Layer. AlignAI is the proprietary governance architecture framework developed from that research.",
          "ByteStream Strategies Inc. is the consulting entity through which the AlignAI framework is delivered. Brian works with enterprise leadership teams in real estate, financial services, and adjacent sectors."
        ],
        linkedin: "https://www.linkedin.com/",
        email: "bburke@bytestream.ca"
      }
    };

    await prisma.page.upsert({
      where: { slug: 'about' },
      update: { metadata: aboutDefaults },
      create: { 
        title: 'About', 
        slug: 'about', 
        content: 'About page content', 
        metadata: aboutDefaults,
        status: 'PUBLISHED',
        template: 'default'
      }
    });
    console.log('Seeded About Page metadata.');

    // Seed Services Page Metadata
    const servicesDefaults = {
      seoTitle: 'Services',
      seoDescription:
        'The AI Decision Visibility Assessment is a structured 4–6 week engagement covering one business domain.',
      hero: {
        kicker: 'The Entry Point',
        title: 'The AI Decision Visibility Assessment.',
        highlight: '',
        description: 'A 4-6 week structured engagement covering one business domain.'
      },
      heroDescription: "A 4-6 week structured engagement covering one business domain. Stands alone as a governance diagnostic, or becomes the foundation for broader architecture work.",
      tags: ["4-6 weeks", "One business domain", "Fixed scope", "Five deliverables", "Platform-agnostic"],
      processSteps: [
        { number: 1, title: "Scoping & Domain Selection", description: "Define the business domain, key AI systems in scope, and stakeholder group." },
        { number: 2, title: "Decision Influence Mapping", description: "Structured sessions to identify every point where AI shapes decisions." },
        { number: 3, title: "Gap Analysis & Classification", description: "Evaluate current governance against what the influence map requires." },
        { number: 4, title: "Deliverable Production", description: "Produce decision register, risk classification, and governance architecture outputs." },
        { number: 5, title: "Executive Readout", description: "Present findings, ownership structure, and implementation roadmap." }
      ],
      deliverables: [
        { title: "AI Decision Influence Map", description: "A structured register of every location where AI is shaping decisions within the domain scope." },
        { title: "Governance Gap Analysis", description: "A documented assessment of what governance architecture exists versus what the influence map requires." },
        { title: "Ownership and Accountability Matrix", description: "Named owners and accountability assignments for each AI-influenced decision domain identified." },
        { title: "Risk Classification Register", description: "Tiered risk classification of all AI decision touchpoints based on operational and regulatory exposure." },
        { title: "Governance Architecture Roadmap", description: "A sequenced roadmap for closing identified governance gaps with implementation priorities." }
      ]
    };

    await prisma.page.upsert({
      where: { slug: 'services' },
      update: { metadata: servicesDefaults },
      create: { 
        title: 'Services', 
        slug: 'services', 
        content: 'Services page content', 
        metadata: servicesDefaults,
        status: 'PUBLISHED',
        template: 'default'
      }
    });
    console.log('Seeded Services Page metadata.');

    // Seed Contact Page Metadata
    const contactDefaults = {
      seoTitle: 'Contact',
      seoDescription:
        'Get in touch with AlignAI by ByteStream Strategies to discuss enterprise AI governance and strategic advisory.',
      email: "bburke@bytestream.ca",
      linkedin: "https://www.linkedin.com/",
      description: "No forms, no demos, no sales calls. A direct conversation about whether there is a fit.",
      subtext: "If you are working on AI governance architecture - or trying to understand whether you should be - this is the conversation to have. Reach out directly. No intake form, no scheduling tool, no SDR."
    };

    await prisma.page.upsert({
      where: { slug: 'contact' },
      update: { metadata: contactDefaults },
      create: { 
        title: 'Contact', 
        slug: 'contact', 
        content: 'Contact page content', 
        metadata: contactDefaults,
        status: 'PUBLISHED',
        template: 'default'
      }
    });
    console.log('Seeded Contact Page metadata.');

    const frameworkDefaults = {
      seoTitle: 'AlignAI Governance Framework',
      seoDescription:
        'Governance architecture for the layer where AI actually changes enterprise behaviour.',
      hero: {
        kicker: 'THE FRAMEWORK',
        title: 'Governance architecture for the layer most frameworks <span class="text-cyan">miss.</span>',
        description: 'AlignAI defines the structural controls for the AI decision environment your organization has already created - but policies, not coherent architecture.'
      },
      pillars: [
        { number: "01", title: "Strategic Alignment", description: "Ensure AI initiatives operate within enterprise strategy. Establish governance authority, investment gating, and executive ownership over the AI decision environment." },
        { number: "02", title: "Decision Visibility", description: "Map every location where AI systems influence operational decisions before humans act. Build the decision influence register your organization does not have yet." },
        { number: "03", title: "Risk Classification", description: "Establish governance tiers based on operational and regulatory exposure. Not every AI touchpoint requires the same level of control, but every one requires classification." },
        { number: "04", title: "Oversight Structures", description: "Define the monitoring, review cadence, override paths, and evidence requirements for each AI-influenced decision domain." },
        { number: "05", title: "Executive Accountability", description: "Assign named ownership for every AI-influenced decision domain. Leadership must be able to answer: who is responsible when AI-influenced decision causes harm?" }
      ],
      conceptualModelKicker: "THE CONCEPTUAL MODEL",
      conceptualModelTitle: "Where AlignAI sits in the enterprise AI stack.",
      conceptualModelDescription:
        "A practical view of how governance architecture integrates with AI systems, decision environments, and executive oversight.",
      modelLayers: [
        { label: "Foundation", title: "Enterprise Operations" },
        { label: "Layer 2", title: "AI Systems (Yardi, Copilot, LLMs, etc.)" },
        { label: "The Gap", title: "AI Decision Influence Layer" },
        { label: "AlignAI", title: "Governance Architecture" },
        { label: "Outcome", title: "Responsible AI Adoption" }
      ]
    };

    await prisma.page.upsert({
      where: { slug: 'framework' },
      update: { metadata: frameworkDefaults },
      create: { 
        title: 'Framework', 
        slug: 'framework', 
        content: 'Framework page content', 
        metadata: frameworkDefaults,
        status: 'PUBLISHED',
        template: 'framework'
      }
    });
    console.log('Seeded Framework Page metadata.');

    const insightsDefaults = {
      seoTitle: 'Insights',
      seoDescription:
        'Articles and analysis on enterprise AI governance, compliance, risk management, and the AlignAI framework.',
      hero: {
        kicker: 'Thought Leadership',
        title:
          'AI governance thinking.<span class="block text-cyan">Grounded in research.</span>',
        description:
          'Perspectives on the governance gap, regulatory exposure, and what enterprise AI accountability actually requires.',
      },
      latestPosts: [
        {
          slug: 'why-ai-governance-matters-now',
          date: '2026-03-06',
          badge: 'Featured',
          title: 'The Governance Layer Nobody Built',
          excerpt:
            'Every major AI governance framework focuses on the model. NIST, ISO 42001, the EU AI Act - all of them. None of them govern where AI actually changes enterprise behaviour.',
        },
        {
          slug: 'ai-governance-for-financial-services',
          date: '2026-03-08',
          badge: 'Real Estate',
          title: 'Your Yardi System Is Making Decisions. Who Owns Them?',
          excerpt:
            'If your organization runs Yardi, MRI, or a comparable property management platform, AI is already embedded in your operations. The governance question most organizations cannot yet answer.',
        },
        {
          slug: 'decision-visibility-assessment-explained',
          date: '2026-03-01',
          badge: '',
          title: 'The Decision Your AI Made This Morning',
          excerpt:
            'Before your first meeting today, AI had already made several decisions on your behalf. Not suggestions. Decisions. The question is whether you know which ones.',
        },
      ],
      samplePost: {
        slug: 'why-ai-governance-matters-now',
        title: 'The Governance Layer Nobody Built',
        date: '2026-03-06',
        tag: 'AI Governance',
        author: 'Brian Burke',
        paragraphs: [
          'Every major AI governance framework in circulation focuses on the model. NIST AI RMF, ISO 42001, the EU AI Act, the proposed Canadian AIDA - all of them are fundamentally concerned with how models are built, trained, documented, and audited.',
          'That is not the wrong thing to govern. But it is not where AI is actually changing enterprise behaviour.',
        ],
      },
    };

    await prisma.page.upsert({
      where: { slug: 'insights' },
      update: { metadata: insightsDefaults, template: 'insights' },
      create: {
        title: 'Insights',
        slug: 'insights',
        content:
          'Articles and analysis on enterprise AI governance, compliance, risk management, and the AlignAI framework.',
        metadata: insightsDefaults,
        status: 'PUBLISHED',
        template: 'insights',
      },
    });
    console.log('Seeded Insights page.');

    const clientAccessDefaults = {
      seoTitle: 'Client Access',
      seoDescription:
        'Secure client portal for AlignAI by ByteStream Strategies project access.',
      clientAccessForm: {
        badge: '• Invitation Only',
        title: 'Client & Partner Access',
        subtitle:
          'Secure access to your AlignAI workspace, reports, and resources.',
        emailLabel: 'Email Address',
        emailPlaceholder: 'you@organization.com',
        passwordLabel: 'Password',
        passwordPlaceholder: '**********',
        submitButton: 'Sign In →',
        footerLine1: 'Access is by invitation only',
        footerLine2: 'To request access, contact bburke@bytestream.ca',
      },
    };

    await prisma.page.upsert({
      where: { slug: 'client-access' },
      update: {
        metadata: clientAccessDefaults,
        content: '',
        status: 'PUBLISHED',
      },
      create: {
        title: 'Client Access',
        slug: 'client-access',
        content: '',
        metadata: clientAccessDefaults,
        status: 'PUBLISHED',
        template: 'blank',
      },
    });
    console.log('Seeded Client Access page.');

    // Also update Info table for Home/Settings if needed
    await prisma.info.update({
      where: { type: InfoType.SETTINGS },
      data: {
        metadata: {
          tagline: "Enterprise AI Governance Architecture",
          siteName: "AlignAI",
          ...homeDefaults.hero
        }
      }
    });
    console.log('Updated Settings Info metadata.');

  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

main();
