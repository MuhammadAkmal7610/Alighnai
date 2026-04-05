import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'
import { ContentStatus, ContentType, InfoType, UserRole } from '@prisma/client'

async function main() {
  console.log('Seeding CMS data...')

  // 1. Settings / General Info
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
          { title: "The Decision Influence Layer", description: "Before your teams make any decision, AI has already shaped what information they see. That layer is entirely ungoverned in most enterprises." },
          { title: "Governance Without Architecture", description: "Most organizations have AI policies, not AI governance architecture. Policy tells people what is allowed. Architecture defines ownership and accountability." },
          { title: "Regulatory Exposure Is Accelerating", description: "DSFI, BO, Fair Housing algorithmic screening, the EU AI Act, and casemark doctrine are converging on AI decision accountability." },
          { title: "The Entry Point Is Visibility", description: "You cannot govern what you cannot see. The first step is mapping where AI is influencing decisions across your enterprise." }
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
      }
    }
  })

  // 5. Home Page
  await prisma.page.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      title: 'Home',
      slug: 'home',
      status: ContentStatus.PUBLISHED,
      content: 'This is the home page content managed by the CMS.',
      metadata: {
        seoTitle: 'Enterprise AI Governance & Strategy',
        seoDescription:
          'AlignAI by ByteStream Strategies helps enterprises deploy AI responsibly with governance frameworks, decision visibility, and strategic advisory.',
        hero: {
          kicker: 'Enterprise AI Governance Architecture',
          title: 'AI is already influencing decisions in your organization.',
          highlight: 'Most enterprises have no governance over that layer.',
          description: 'AlignAI governs the AI Decision Influence Layer — the environment created by AI systems before humans make decisions. Built for enterprise. Grounded in doctoral research.'
        },
        problems: [
          { title: "The Decision Influence Layer", description: "Before your teams make any decision, AI has already shaped what information they see. That layer is entirely ungoverned in most enterprises." },
          { title: "Governance Without Architecture", description: "Most organizations have AI policies, not AI governance architecture. Policy tells people what is allowed. Architecture defines ownership and accountability." },
          { title: "Regulatory Exposure Is Accelerating", description: "DSFI, BO, Fair Housing algorithmic screening, the EU AI Act, and casemark doctrine are converging on AI decision accountability." },
          { title: "The Entry Point Is Visibility", description: "You cannot govern what you cannot see. The first step is mapping where AI is influencing decisions across your enterprise." }
        ],
        gapKicker: "THE GOVERNANCE GAP",
        gapTitle: "Every major AI governance framework is focused on the wrong layer.",
        gapDescription:
          "<p>NIST, ISO 42001, and the EU AI Act focus on models, training data, and compliance outputs. They do not govern where AI actually changes enterprise behavior.</p>",
        credentials: ["PhD - Carleton University", "MBA - University of Ottawa", "PMP Certified", "30+ Years Enterprise"]
      }
    }
  })

  // 6. About Page
  await prisma.page.upsert({
    where: { slug: 'about' },
    update: {},
    create: {
      title: 'About AlignAI',
      slug: 'about',
      status: ContentStatus.PUBLISHED,
      content: 'Learn about AlignAI by ByteStream Strategies — our mission, expertise, and commitment to responsible enterprise AI governance.',
      metadata: {
        seoTitle: 'About AlignAI',
        seoDescription:
          'Learn about AlignAI by ByteStream Strategies — our mission, expertise, and commitment to responsible enterprise AI governance.',
        hero: {
          title: 'Built from doctoral research.',
          highlight: 'Delivered with 30 years of enterprise experience.'
        },
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

  // 7. Contact Page
  await prisma.page.upsert({
    where: { slug: 'contact' },
    update: {},
    create: {
      title: 'Contact',
      slug: 'contact',
      status: ContentStatus.PUBLISHED,
      content: 'Start a conversation.',
      metadata: {
        seoTitle: 'Contact',
        seoDescription:
          'Get in touch with AlignAI by ByteStream Strategies to discuss enterprise AI governance and strategic advisory.',
        kicker: 'ByteStream Strategies',
        title: 'Start a conversation.',
        description: "No forms, no demos, no sales calls. A direct conversation about whether there is a fit.",
        email: "bburke@bytestream.ca",
        linkedin: "https://www.linkedin.com/",
        subtext: "If you are working on AI governance architecture - or trying to understand whether you should be - this is the conversation to have. Reach out directly. No intake form, no scheduling tool, no SDR."
      }
    }
  })

  // 8. Services Page
  await prisma.page.upsert({
    where: { slug: 'services' },
    update: {},
    create: {
      title: 'Services',
      slug: 'services',
      status: ContentStatus.PUBLISHED,
      content: 'The AI Decision Visibility Assessment is a structured 4–6 week engagement covering one business domain.',
      metadata: {
        seoTitle: 'Services',
        seoDescription:
          'The AI Decision Visibility Assessment is a structured 4–6 week engagement covering one business domain.',
        hero: {
          kicker: 'The Entry Point',
          title: 'The AI Decision Visibility Assessment.',
          description: "A 4-6 week structured engagement covering one business domain. Stands alone as a governance diagnostic, or becomes the foundation for broader architecture work."
        },
        engagement: {
          title: 'A structured engagement. A standing deliverable.',
          description: 'The Assessment is delivered through ByteStream Strategies. No platform required. No implementation prerequisite. Applicable regardless of what AI systems you currently use.',
          tags: ["4-6 weeks", "One business domain", "Fixed scope", "Five deliverables", "Platform-agnostic"]
        },
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
      }
    }
  })

  // 9. Insights Page
  await prisma.page.upsert({
    where: { slug: 'insights' },
    update: {},
    create: {
      title: 'Insights',
      slug: 'insights',
      status: ContentStatus.PUBLISHED,
      template: 'insights',
      content:
        'Articles and analysis on enterprise AI governance, compliance, risk management, and the AlignAI framework.',
      metadata: {
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
      },
    },
  })

  // 9b. Client Access — published so /site/client-access uses CMS PageRenderer
  await prisma.page.upsert({
    where: { slug: 'client-access' },
    update: {
      title: 'Client Access',
      template: 'blank',
      status: ContentStatus.PUBLISHED,
      content: '',
      metadata: {
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
      },
    },
    create: {
      title: 'Client Access',
      slug: 'client-access',
      status: ContentStatus.PUBLISHED,
      template: 'blank',
      content: '',
      metadata: {
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
      },
    },
  })

  console.log('Seeding categories...')
  const categories = [
    { name: 'Governance', slug: 'governance', color: '#0ea5e9' },
    { name: 'Strategy', slug: 'strategy', color: '#10b981' },
    { name: 'Technology', slug: 'technology', color: '#8b5cf6' },
    { name: 'Policy', slug: 'policy', color: '#f59e0b' }
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat
    })
  }

  const adminEmail = (process.env.CMS_ADMIN_EMAIL || 'admin@alignai.com')
    .trim()
    .toLowerCase()
  const adminPassword = process.env.CMS_ADMIN_PASSWORD
  if (adminPassword && adminPassword.length >= 8) {
    const passwordHash = await bcrypt.hash(adminPassword, 12)
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { passwordHash, role: UserRole.ADMIN, name: 'CMS Admin' },
      create: {
        email: adminEmail,
        name: 'CMS Admin',
        role: UserRole.ADMIN,
        passwordHash,
      },
    })
    console.log('Seeded CMS admin user:', adminEmail)
  } else {
    console.warn(
      'CMS_ADMIN_PASSWORD not set or shorter than 8 characters; skipped CMS admin user seed.'
    )
  }

  // 10. Insight articles as Content (same slugs/titles as Insights page listing)
  const governanceCat = await prisma.category.findUnique({
    where: { slug: 'governance' },
    select: { id: true },
  })
  const strategyCat = await prisma.category.findUnique({
    where: { slug: 'strategy' },
    select: { id: true },
  })
  const policyCat = await prisma.category.findUnique({
    where: { slug: 'policy' },
    select: { id: true },
  })

  const cmsAuthor = await prisma.user.findFirst({
    where: { email: adminEmail },
    select: { id: true },
  })

  const insightArticles: Array<{
    slug: string
    title: string
    excerpt: string
    content: string
    publishedAt: Date
    featured: boolean
    categoryId: string | undefined
    metadata?: Record<string, unknown>
  }> = [
    {
      slug: 'why-ai-governance-matters-now',
      title: 'The Governance Layer Nobody Built',
      excerpt:
        'Every major AI governance framework focuses on the model. NIST, ISO 42001, the EU AI Act - all of them. None of them govern where AI actually changes enterprise behaviour.',
      content: [
        '<p>Every major AI governance framework in circulation focuses on the model. NIST AI RMF, ISO 42001, the EU AI Act, the proposed Canadian AIDA — all of them are fundamentally concerned with how models are built, trained, documented, and audited.</p>',
        '<p>That is not the wrong thing to govern. But it is not where AI is actually changing enterprise behaviour.</p>',
        '<p>The governance layer that matters is the one enterprises have not mapped: where AI shapes what people see, what they prioritize, and what they decide before a human ever acts.</p>',
      ].join('\n'),
      publishedAt: new Date('2026-03-06T12:00:00.000Z'),
      featured: true,
      categoryId: governanceCat?.id,
      metadata: { listBadge: 'Featured' },
    },
    {
      slug: 'ai-governance-for-financial-services',
      title: 'Your Yardi System Is Making Decisions. Who Owns Them?',
      excerpt:
        'If your organization runs Yardi, MRI, or a comparable property management platform, AI is already embedded in your operations. The governance question most organizations cannot yet answer.',
      content: [
        '<p>If your organization runs Yardi, MRI, or a comparable property management platform, AI is already embedded in your operations — not only in obvious automation, but in ranking, routing, and recommendations that change what staff and tenants experience.</p>',
        '<p>The governance question most organizations cannot yet answer is simple to ask and difficult to answer: who is accountable when an AI-influenced workflow produces a harmful or non-compliant outcome?</p>',
        '<p>AlignAI treats that question as architectural, not rhetorical: map decision influence, assign ownership, and align controls to regulatory and operational exposure.</p>',
      ].join('\n'),
      publishedAt: new Date('2026-03-08T12:00:00.000Z'),
      featured: false,
      categoryId: strategyCat?.id,
      metadata: { listBadge: 'Real Estate' },
    },
    {
      slug: 'decision-visibility-assessment-explained',
      title: 'The Decision Your AI Made This Morning',
      excerpt:
        'Before your first meeting today, AI had already made several decisions on your behalf. Not suggestions. Decisions. The question is whether you know which ones.',
      content: [
        '<p>Before your first meeting today, AI had already made several decisions on your behalf. Not suggestions. Decisions embedded in dashboards, inboxes, and workflow tools.</p>',
        '<p>The question is whether you know which ones — and whether your governance architecture can evidence who approved, who monitors, and who is accountable when something goes wrong.</p>',
        '<p>Decision visibility is the entry point: you cannot govern influence you cannot see.</p>',
      ].join('\n'),
      publishedAt: new Date('2026-03-01T12:00:00.000Z'),
      featured: false,
      categoryId: policyCat?.id,
    },
  ]

  for (const article of insightArticles) {
    await prisma.content.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        type: ContentType.BLOG_POST,
        status: ContentStatus.PUBLISHED,
        featured: article.featured,
        publishedAt: article.publishedAt,
        categoryId: article.categoryId ?? null,
        authorId: cmsAuthor?.id ?? null,
        metadata: article.metadata as object | undefined,
      },
      create: {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        type: ContentType.BLOG_POST,
        status: ContentStatus.PUBLISHED,
        featured: article.featured,
        publishedAt: article.publishedAt,
        categoryId: article.categoryId,
        authorId: cmsAuthor?.id,
        metadata: article.metadata as object | undefined,
      },
    })
  }
  console.log(`Seeded ${insightArticles.length} insight articles into Content.`)

  const clientResourceCount = await prisma.clientResource.count()
  if (clientResourceCount === 0) {
    await prisma.clientResource.createMany({
      data: [
        {
          title: 'AlignAI framework overview',
          description: 'Public overview of the governance framework (opens on the marketing site).',
          fileUrl: '/site/framework',
          sortOrder: 0,
        },
        {
          title: 'Decision Visibility Assessment — explainer',
          description: 'What the assessment covers and typical outcomes.',
          fileUrl: '/site/insights/decision-visibility-assessment-explained',
          sortOrder: 1,
        },
        {
          title: 'Contact AlignAI',
          description: 'Reach the team for questions about your engagement.',
          fileUrl: '/site/contact',
          sortOrder: 2,
        },
      ],
    })
    console.log('Seeded default client portal resources (empty library).')
  }

  console.log('CMS Seeded successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
