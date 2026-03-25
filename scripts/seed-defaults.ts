
import 'dotenv/config';
import { prisma } from '../lib/prisma';
import { InfoType } from '@prisma/client';

async function main() {
  try {
    // Seed Home Page Metadata
    const homeDefaults = {
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
