"use client"

import { useState } from "react"
import Link from "next/link"
import { CTASection } from "@/components/CTASection"
import { CMSEditor } from "./CMSEditor"
import { cn } from "@/lib/utils"

interface PageRendererProps {
  page: any
  isEditing?: boolean
  onContentChange?: (content: string) => void
  onMetadataChange?: (metadata: any) => void
}

export function PageRenderer({ page, isEditing, onContentChange, onMetadataChange }: PageRendererProps) {
  const data = (page?.metadata as any) || {}
  const slug = page?.slug
  const dbTemplate = page?.template
  const template = (dbTemplate && dbTemplate !== 'default' && dbTemplate !== 'blank') 
    ? dbTemplate 
    : (slug === 'home' ? 'home' : (slug === 'about' ? 'about' : (slug === 'framework' ? 'framework' : (slug === 'services' ? 'services' : (slug === 'contact' ? 'contact' : 'blank')))))

  // Page specific elements
  const isHome = template === 'home'
  const isAbout = template === 'about'
  const isFramework = template === 'framework'
  const isServices = template === 'services'
  const isContact = template === 'contact'
  const isBlank = template === 'blank'
  
  const hero = data.hero || {
    kicker: isHome ? 'Enterprise AI Governance Architecture' : (isAbout ? 'The Founder' : (isFramework ? 'The Framework' : (isServices ? 'The Entry Point' : (isContact ? 'ByteStream Strategies' : 'New Page')))),
    title: isHome ? 'AI is already influencing decisions in your organization.' : (isAbout ? 'Built from doctoral research.' : (isFramework ? 'Governance architecture for the layer most frameworks miss.' : (isServices ? 'The AI Decision Visibility <span class="block text-cyan">Assessment.</span>' : (isContact ? 'Start a conversation.' : 'Start building your new page content...')))),
    highlight: isHome ? 'Most enterprises have no governance over that layer.' : '',
    description: isHome ? 'AlignAI governs the AI Decision Influence Layer — the environment created by AI systems before humans make decisions.' : (isAbout ? 'Delivered with 30 years of enterprise experience.' : (isFramework ? 'AlignAI defines the structural controls for the AI decision environment your organization has already created.' : (isServices ? 'A 4-6 week structured engagement covering one business domain.' : (isContact ? 'No forms, no demos, no sales calls.' : 'Use the editor below to add your page description and content.'))))
  }

  const problems = data.problems || []
  const founder = data.founder || {
    name: 'Brian Burke',
    title: 'AI Governance Architect · Founder, ByteStream Strategies Inc.',
    credentials: ["PhD", "MBA", "PMP", "30+ Years Enterprise"],
    bio: ["Brian Burke holds a PhD...", "AlignAI is the proprietary..."]
  }
  const pillars = data.pillars || []
  const processSteps = data.processSteps || []
  const deliverables = data.deliverables || []
  const tags = data.tags || []
  const cta = data.cta || {
    title: 'Ready to understand what your AI is actually deciding?',
    description: 'No platform required. No prior governance work needed.'
  }

  // Metadata update helpers
  const updateHero = (field: string, value: string) => {
    if (onMetadataChange) {
      onMetadataChange({
        ...data,
        hero: {
          ...hero,
          [field]: value
        }
      })
    }
  }

  const updateFounder = (field: string, value: any) => {
    if (onMetadataChange) {
      onMetadataChange({
        ...data,
        founder: {
          ...founder,
          [field]: value
        }
      })
    }
  }

  const updateFounderBio = (index: number, value: string) => {
    if (onMetadataChange) {
      const newBio = [...founder.bio]
      newBio[index] = value
      onMetadataChange({
        ...data,
        founder: {
          ...founder,
          bio: newBio
        }
      })
    }
  }

  const updatePillar = (index: number, field: string, value: string) => {
    if (onMetadataChange) {
      const newPillars = [...pillars]
      newPillars[index] = { ...newPillars[index], [field]: value }
      onMetadataChange({
        ...data,
        pillars: newPillars
      })
    }
  }

  const updateProblem = (index: number, field: string, value: string) => {
    if (onMetadataChange) {
      const newProblems = [...problems]
      newProblems[index] = { ...newProblems[index], [field]: value }
      onMetadataChange({
        ...data,
        problems: newProblems
      })
    }
  }

  const updateCTA = (field: string, value: string) => {
    if (onMetadataChange) {
      onMetadataChange({
        ...data,
        cta: {
          ...cta,
          [field]: value
        }
      })
    }
  }

  const updateMetadata = (field: string, value: any) => {
    if (onMetadataChange) {
      onMetadataChange({
        ...data,
        [field]: value
      })
    }
  }

  const updateServiceArrayItem = (field: string, index: number, subfield: string, value: string) => {
    if (onMetadataChange) {
      const newArray = [...(data[field] || [])]
      newArray[index] = { ...newArray[index], [subfield]: value }
      onMetadataChange({
        ...data,
        [field]: newArray
      })
    }
  }

  const [editingField, setEditingField] = useState<string | null>(null)

  return (
    <div className={cn("flex flex-col min-h-screen font-body", isEditing ? "bg-slate-900/10" : "bg-navy")}>
      {/* Hero Section */}
      <section className={cn(
        "pt-32 pb-20 md:pt-44 md:pb-32 relative",
        (isHome || isAbout || isFramework || isServices) ? "hero-panel" : "bg-navy"
      )} id="hero">
        <div className="container-main relative z-10">
          {/* Decorative Triangle from target site */}
          {(isHome || isFramework) && !isEditing && (
            <div className="absolute top-0 right-0 w-[40%] h-full pointer-events-none overflow-hidden opacity-10">
               <div className="absolute top-1/2 right-0 -translate-y-1/2 w-0 h-0 border-l-[300px] border-l-transparent border-b-[500px] border-b-white transform rotate-12" />
            </div>
          )}

          <div className="max-w-4xl">
            {/* Kicker */}
            {isEditing && editingField === 'kicker' ? (
              <div className="mb-6">
                <CMSEditor 
                  variant="ghost"
                  content={hero.kicker}
                  onChange={(val) => updateHero('kicker', val)}
                  onDone={() => setEditingField(null)}
                  placeholder="Enter kicker..."
                />
              </div>
            ) : (
              <div 
                className={cn("hero-kicker mb-8", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                onDoubleClick={() => isEditing && setEditingField('kicker')}
                dangerouslySetInnerHTML={{ __html: hero.kicker || (isHome ? 'Enterprise AI Governance Architecture' : (isAbout ? 'The Founder' : (isFramework ? 'The Framework' : (isServices ? 'The Entry Point' : 'New Page')))) }}
              />
            )}

            {/* Title */}
            {isEditing && editingField === 'title' ? (
              <div className="mb-8">
                <CMSEditor 
                  variant="ghost"
                  content={hero.title}
                  onChange={(val) => updateHero('title', val)}
                  onDone={() => setEditingField(null)}
                  placeholder="Enter title..."
                />
              </div>
            ) : (
              <h1 
                className={cn(
                  "text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl leading-[1.05] mb-8 font-heading",
                  isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1"
                )}
                onDoubleClick={() => isEditing && setEditingField('title')}
                dangerouslySetInnerHTML={{ __html: hero.title || (isHome ? 'AI is already influencing decisions in your organization.' : (isAbout ? 'Built from doctoral research.' : (isFramework ? 'Governance architecture for the layer most frameworks miss.' : (isServices ? 'The AI Decision Visibility <span class="block text-cyan">Assessment.</span>' : 'Start building your new page title...')))) }}
              />
            )}

            {/* Highlight (Home Only) */}
            {isHome && (
              isEditing && editingField === 'highlight' ? (
                <div className="mb-10">
                  <CMSEditor 
                    variant="ghost"
                    content={hero.highlight}
                    onChange={(val) => updateHero('highlight', val)}
                    onDone={() => setEditingField(null)}
                    placeholder="Enter highlight..."
                  />
                </div>
              ) : (
                <h1 
                  className={cn(
                    "text-5xl font-bold tracking-tight text-cyan md:text-7xl lg:text-8xl leading-[1.05] mb-10 font-heading",
                    isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1"
                  )}
                  onDoubleClick={() => isEditing && setEditingField('highlight')}
                  dangerouslySetInnerHTML={{ __html: hero.highlight || 'Most enterprises have no governance over that layer.' }}
                />
              )
            )}

            {/* Description */}
            {isEditing && editingField === 'description' ? (
              <div className="mb-12">
                <CMSEditor 
                  variant="ghost"
                  content={isServices ? data.heroDescription : hero.description}
                  onChange={(val) => isServices ? updateMetadata('heroDescription', val) : updateHero('description', val)}
                  onDone={() => setEditingField(null)}
                  placeholder="Enter description..."
                />
              </div>
            ) : (
              <div 
                className={cn(
                  "mb-12 max-w-2xl text-lg text-slate md:text-xl font-medium leading-relaxed opacity-90",
                  isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1"
                )}
                onDoubleClick={() => isEditing && setEditingField('description')}
                dangerouslySetInnerHTML={{ __html: (isServices ? data.heroDescription : hero.description) || (isHome ? 'AlignAI governs the AI Decision Influence Layer — the environment created by AI systems before humans make decisions.' : (isAbout ? 'Delivered with 30 years of enterprise experience.' : 'AlignAI defines the structural controls for the AI decision environment your organization has already created.')) }}
              />
            )}

            {/* Hero Buttons (from target site) */}
            {isHome && !isEditing && (
              <div className="flex flex-wrap gap-4 mt-12">
                <Link 
                  href="/site/framework" 
                  className="bg-cyan hover:bg-white text-navy font-bold py-4 px-8 rounded-[4px] transition-all flex items-center gap-2 group text-sm uppercase tracking-wider"
                >
                  Explore the framework
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <Link 
                  href="/site/contact" 
                  className="bg-transparent hover:bg-white/10 text-white border border-white/50 font-bold py-4 px-8 rounded-[4px] transition-all flex items-center gap-2 text-sm uppercase tracking-wider"
                >
                  Start a conversation
                  <span>→</span>
                </Link>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="mt-16">
            {isEditing && editingField === 'content' ? (
              <div className="space-y-4">
                <CMSEditor 
                  content={page?.content || ''} 
                  onChange={(content) => onContentChange?.(content)} 
                  onDone={() => setEditingField(null)}
                />
              </div>
            ) : (
              <div 
                className={cn(
                  "prose prose-invert max-w-none text-slate opacity-90 leading-relaxed",
                  isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded p-4 bg-white/5"
                )}
                onDoubleClick={() => isEditing && setEditingField('content')}
              >
                {page?.content ? (
                  <div dangerouslySetInnerHTML={{ __html: page.content }} />
                ) : (
                  <p className="italic text-white/20">Double-click to add content...</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Specific Section (Founder - Dark Minimalist) */}
      {isAbout && (
        <>
          <div className="section-divider" />
          <section className="bg-navy py-32 border-b border-white/5">
            <div className="container-main">
              <div className="grid gap-20 lg:grid-cols-[380px_1fr] lg:gap-24">
                <div className="relative group">
                  <div className="absolute inset-0 bg-cyan/10 translate-x-4 translate-y-4 rounded-sm transition-transform group-hover:translate-x-2 group-hover:translate-y-2" />
                  <div className="relative aspect-[3/4] w-full rounded-sm bg-[#0A1F44] border border-white/10 flex items-center justify-center text-slate/40 text-[10px] font-bold uppercase tracking-widest overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
                    <span>Headshot [Brian Burke]</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-8">
                     <div className="h-px w-8 bg-cyan" />
                     <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan">The Founder</p>
                  </div>

                  {isEditing && editingField === 'founder.name' ? (
                    <div className="mb-6">
                      <CMSEditor 
                        variant="ghost"
                        content={founder.name}
                        onChange={(val) => updateFounder('name', val)}
                        onDone={() => setEditingField(null)}
                      />
                    </div>
                  ) : (
                    <h2 
                      className={cn("text-5xl font-bold text-white font-heading", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                      onDoubleClick={() => isEditing && setEditingField('founder.name')}
                      dangerouslySetInnerHTML={{ __html: founder.name }}
                    />
                  )}

                  {isEditing && editingField === 'founder.title' ? (
                    <div className="mb-8">
                      <CMSEditor 
                        variant="ghost"
                        content={founder.title}
                        onChange={(val) => updateFounder('title', val)}
                        onDone={() => setEditingField(null)}
                      />
                    </div>
                  ) : (
                    <p 
                      className={cn("text-cyan font-bold tracking-wide mt-2 text-sm uppercase", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                      onDoubleClick={() => isEditing && setEditingField('founder.title')}
                      dangerouslySetInnerHTML={{ __html: founder.title }}
                    />
                  )}

                  <div className="mt-12 space-y-8 text-slate text-lg leading-relaxed opacity-80">
                    {founder.bio.map((p: string, i: number) => (
                      <div key={i}>
                        {isEditing && editingField === `founder.bio.${i}` ? (
                          <div className="mb-6">
                            <CMSEditor 
                              variant="ghost"
                              content={p}
                              onChange={(val) => updateFounderBio(i, val)}
                              onDone={() => setEditingField(null)}
                            />
                          </div>
                        ) : (
                          <div 
                            className={cn(isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                            onDoubleClick={() => isEditing && setEditingField(`founder.bio.${i}`)}
                            dangerouslySetInnerHTML={{ __html: p }}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-16 flex flex-wrap gap-12">
                     {founder.credentials.map((cred: string, i: number) => (
                       <div key={i} className="flex flex-col">
                          <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Status</span>
                          <span className="text-white font-bold text-sm tracking-wide">{cred}</span>
                       </div>
                     ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Framework Specific Sections (Vertical Timeline) */}
      {isFramework && (
        <>
          <div className="section-divider" />
          <section className="bg-navy py-32">
            <div className="container-main">
              {isEditing && editingField === 'pillars.kicker' ? (
                <CMSEditor 
                   variant="ghost"
                   content={data.pillarsKicker || "Five Governance Pillars"}
                   onChange={(val) => updateMetadata('pillarsKicker', val)}
                   onDone={() => setEditingField(null)}
                />
              ) : (
                <p 
                    className={cn("hero-kicker mb-12", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                    onDoubleClick={() => isEditing && setEditingField('pillars.kicker')}
                    dangerouslySetInnerHTML={{ __html: data.pillarsKicker || "Five Governance Pillars" }}
                />
              )}
              
              <div className="relative mt-20 max-w-5xl mx-auto">
                {/* Vertical Line */}
                <div className="absolute left-[7px] md:left-[240px] top-0 bottom-0 w-px bg-white/10" />

                <div className="space-y-16">
                  {pillars.map((pillar: any, i: number) => (
                    <div key={pillar.number || i} className="relative flex flex-col md:flex-row gap-8 pl-10 md:pl-0">
                      {/* Left Column (Title/Number) */}
                      <div className="md:w-[220px] md:text-right flex flex-col justify-center">
                        <div className="flex flex-col md:items-end">
                           <span className="text-[10px] font-bold text-cyan uppercase tracking-widest mb-1">0{pillar.number || i + 1}</span>
                           {isEditing && editingField === `pillars.${i}.title` ? (
                            <CMSEditor 
                              variant="ghost"
                              content={pillar.title}
                              onChange={(val) => updatePillar(i, 'title', val)}
                              onDone={() => setEditingField(null)}
                            />
                          ) : (
                            <h3 
                              className={cn("text-2xl font-bold text-white", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                              onDoubleClick={() => isEditing && setEditingField(`pillars.${i}.title`)}
                              dangerouslySetInnerHTML={{ __html: pillar.title }}
                            />
                          )}
                        </div>
                      </div>

                      {/* Middle Node */}
                      <div className="absolute left-0 md:left-[233px] top-1/2 -translate-y-1/2">
                         <div className="w-4 h-4 rounded-full border-2 border-cyan bg-navy z-10" />
                      </div>

                      {/* Right Column (Description) */}
                      <div className="flex-1 md:pl-12 py-2 flex items-center">
                        {isEditing && editingField === `pillars.${i}.description` ? (
                          <CMSEditor 
                            variant="ghost"
                            content={pillar.description}
                            onChange={(val) => updatePillar(i, 'description', val)}
                            onDone={() => setEditingField(null)}
                          />
                        ) : (
                          <div 
                            className={cn("text-slate text-lg leading-relaxed max-w-2xl opacity-80", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                            onDoubleClick={() => isEditing && setEditingField(`pillars.${i}.description`)}
                            dangerouslySetInnerHTML={{ __html: pillar.description }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Home Specific Section (Governance Gap - White Section) */}
      {isHome && (
        <>
          <div className="section-divider" />
          <section className="bg-white py-32 text-navy">
            <div className="container-main">
              {isEditing && editingField === 'home.gap.kicker' ? (
                <CMSEditor 
                   variant="ghost"
                   content={data.gapKicker || "The Governance Gap"}
                   onChange={(val) => updateMetadata('gapKicker', val)}
                   onDone={() => setEditingField(null)}
                />
              ) : (
                <div className="flex items-center gap-4 mb-10">
                   <div className="h-px w-8 bg-mid-blue" />
                   <p 
                        className={cn("text-[11px] font-bold uppercase tracking-[0.2em] text-mid-blue", isEditing && "hover:ring-1 hover:ring-mid-blue/30 cursor-edit transition-all rounded px-1")}
                        onDoubleClick={() => isEditing && setEditingField('home.gap.kicker')}
                        dangerouslySetInnerHTML={{ __html: data.gapKicker || "The Governance Gap" }}
                    />
                </div>
              )}

              {isEditing && editingField === 'home.gap.title' ? (
                <div className="mt-4 max-w-3xl">
                    <CMSEditor 
                    variant="ghost"
                    content={data.gapTitle || "Every major AI governance framework is focused on the wrong layer."}
                    onChange={(val) => updateMetadata('gapTitle', val)}
                    onDone={() => setEditingField(null)}
                    />
                </div>
              ) : (
                <h2 
                    className={cn("mt-4 max-w-4xl text-5xl leading-[1.1] text-navy md:text-7xl font-bold font-heading", isEditing && "hover:ring-1 hover:ring-mid-blue/30 cursor-edit transition-all rounded px-1")}
                    onDoubleClick={() => isEditing && setEditingField('home.gap.title')}
                    dangerouslySetInnerHTML={{ __html: data.gapTitle || "Every major AI governance framework is focused on the wrong layer." }}
                />
              )}
              
              <p className="mt-10 max-w-2xl text-slate text-lg leading-relaxed opacity-80">
                 NIST, ISO 42001, and the EU AI Act focus on models, training data, and compliance outputs. They do not govern where AI actually changes enterprise behavior.
              </p>

              <div className="mt-24 grid md:grid-cols-2 border border-slate-100">
                {problems.map((problem: any, index: number) => (
                  <div key={index} className={cn(
                    "bg-white p-16 transition-all group hover:bg-slate-50/50",
                    index === 0 ? "border-b border-r border-slate-100" : "",
                    index === 1 ? "border-b border-slate-100" : "",
                    index === 2 ? "border-r border-slate-100" : "",
                    index === 3 ? "" : ""
                  )}>
                    <div className="flex flex-col h-full">
                       <span className="text-[10px] font-bold text-slate/30 mb-6 tracking-[0.3em] uppercase">0{index + 1}</span>
                      {isEditing && editingField === `problems.${index}.title` ? (
                        <div className="mb-4">
                          <CMSEditor 
                            variant="ghost"
                            content={problem.title}
                            onChange={(val) => updateProblem(index, 'title', val)}
                            onDone={() => setEditingField(null)}
                            placeholder="Enter problem title..."
                          />
                        </div>
                      ) : (
                        <h3 
                          className={cn("text-2xl text-navy font-bold mb-6 font-heading", isEditing && "hover:ring-1 hover:ring-mid-blue/30 cursor-edit transition-all rounded px-1")}
                          onDoubleClick={() => isEditing && setEditingField(`problems.${index}.title`)}
                          dangerouslySetInnerHTML={{ __html: problem.title }}
                        />
                      )}

                      {isEditing && editingField === `problems.${index}.description` ? (
                        <div className="flex-1">
                          <CMSEditor 
                            variant="ghost"
                            content={problem.description}
                            onChange={(val) => updateProblem(index, 'description', val)}
                            onDone={() => setEditingField(null)}
                            placeholder="Enter problem description..."
                          />
                        </div>
                      ) : (
                        <div 
                          className={cn("text-slate text-lg leading-relaxed opacity-70 flex-1", isEditing && "hover:ring-1 hover:ring-mid-blue/30 cursor-edit transition-all rounded px-1")}
                          onDoubleClick={() => isEditing && setEditingField(`problems.${index}.description`)}
                          dangerouslySetInnerHTML={{ __html: problem.description }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Services Specific Section (Structured & Technical) */}
      {isServices && (
        <>
          <div className="section-divider" />
          <section className="bg-[#08162e] py-32 border-b border-white/5">
            <div className="container-main">
              <div className="grid gap-20 lg:grid-cols-[1fr_450px] lg:gap-24">
                {/* Process Steps */}
                <div>
                  {isEditing && editingField === 'services.engagement.kicker' ? (
                     <CMSEditor 
                        variant="ghost"
                        content={data.engagementKicker || "The Engagement"}
                        onChange={(val) => updateMetadata('engagementKicker', val)}
                        onDone={() => setEditingField(null)}
                     />
                  ) : (
                    <div className="flex items-center gap-4 mb-8">
                       <div className="h-px w-8 bg-cyan" />
                       <p 
                          className={cn("text-[11px] font-bold uppercase tracking-[0.2em] text-cyan", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                          onDoubleClick={() => isEditing && setEditingField('services.engagement.kicker')}
                          dangerouslySetInnerHTML={{ __html: data.engagementKicker || "The Engagement" }}
                       />
                    </div>
                  )}

                  {isEditing && editingField === 'services.engagement.title' ? (
                     <div className="mt-6">
                        <CMSEditor 
                            variant="ghost"
                            content={data.engagementTitle || "A structured engagement. A standing deliverable."}
                            onChange={(val) => updateMetadata('engagementTitle', val)}
                            onDone={() => setEditingField(null)}
                        />
                     </div>
                  ) : (
                    <h2 
                        className={cn("mt-6 text-4xl leading-tight text-white font-bold font-heading md:text-5xl", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                        onDoubleClick={() => isEditing && setEditingField('services.engagement.title')}
                        dangerouslySetInnerHTML={{ __html: data.engagementTitle || "A structured engagement. A standing deliverable." }}
                    />
                  )}

                  <div className="mt-10 max-w-2xl space-y-6 text-lg leading-relaxed text-slate opacity-80 font-medium">
                    {isEditing && editingField === 'engagement.desc1' ? (
                      <CMSEditor 
                        variant="ghost"
                        content={data.engagementDesc1 || "The Assessment is delivered through ByteStream Strategies. No platform required. No implementation prerequisite. Applicable regardless of what AI systems you currently use."}
                        onChange={(val) => updateMetadata('engagementDesc1', val)}
                        onDone={() => setEditingField(null)}
                      />
                    ) : (
                      <p 
                        className={cn(isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                        onDoubleClick={() => isEditing && setEditingField('engagement.desc1')}
                        dangerouslySetInnerHTML={{ __html: data.engagementDesc1 || "The Assessment is delivered through ByteStream Strategies. No platform required. No implementation prerequisite. Applicable regardless of what AI systems you currently use." }}
                      />
                    )}

                    {isEditing && editingField === 'engagement.desc2' ? (
                      <CMSEditor 
                        variant="ghost"
                        content={data.engagementDesc2 || "It stands alone as a governance diagnostic, or it becomes the foundation for broader architecture work under the AlignAI framework."}
                        onChange={(val) => updateMetadata('engagementDesc2', val)}
                        onDone={() => setEditingField(null)}
                      />
                    ) : (
                      <p 
                        className={cn(isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                        onDoubleClick={() => isEditing && setEditingField('engagement.desc2')}
                        dangerouslySetInnerHTML={{ __html: data.engagementDesc2 || "It stands alone as a governance diagnostic, or it becomes the foundation for broader architecture work under the AlignAI framework." }}
                      />
                    )}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3 mb-16">
                    {tags.map((tag: string, i: number) => (
                      <div key={i}>
                        {isEditing && editingField === `tags.${i}` ? (
                           <CMSEditor 
                            variant="ghost"
                            content={tag}
                            onChange={(val) => {
                                const newTags = [...tags]
                                newTags[i] = val
                                updateMetadata('tags', newTags)
                            }}
                            onDone={() => setEditingField(null)}
                          />
                        ) : (
                           <span 
                            className={cn("rounded-sm border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate hover:text-cyan transition-colors", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all")}
                            onDoubleClick={() => isEditing && setEditingField(`tags.${i}`)}
                            dangerouslySetInnerHTML={{ __html: tag }}
                           />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-20">
                    <div className="flex items-center gap-4 mb-8">
                       <div className="h-px w-8 bg-cyan" />
                       <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan">How It Works</p>
                    </div>
                    
                    <ol className="mt-12 divide-y divide-white/5 border-t border-white/5">
                      {processSteps.map((step: any, index: number) => (
                        <li key={index} className="py-10 grid md:grid-cols-[60px_1fr] group">
                          <span className="font-heading text-2xl font-bold text-cyan opacity-40 group-hover:opacity-100 transition-opacity">
                            0{index + 1}
                          </span>
                          <div>
                            {isEditing && editingField === `processSteps.${index}.title` ? (
                              <div className="mb-4">
                                <CMSEditor 
                                  variant="ghost"
                                  content={step.title}
                                  onChange={(val) => updateServiceArrayItem('processSteps', index, 'title', val)}
                                  onDone={() => setEditingField(null)}
                                />
                              </div>
                            ) : (
                              <h3 
                                className={cn("text-2xl font-bold text-white font-heading mb-4", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                                onDoubleClick={() => isEditing && setEditingField(`processSteps.${index}.title`)}
                                dangerouslySetInnerHTML={{ __html: step.title }}
                              />
                            )}

                            {isEditing && editingField === `processSteps.${index}.description` ? (
                              <div className="mt-2 text-slate">
                                <CMSEditor 
                                  variant="ghost"
                                  content={step.description}
                                  onChange={(val) => updateServiceArrayItem('processSteps', index, 'description', val)}
                                  onDone={() => setEditingField(null)}
                                />
                              </div>
                            ) : (
                              <p 
                                className={cn("text-lg leading-relaxed text-slate opacity-70", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                                onDoubleClick={() => isEditing && setEditingField(`processSteps.${index}.description`)}
                                dangerouslySetInnerHTML={{ __html: step.description }}
                              />
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Deliverables Column (Minimal Fixed Style) */}
                <div className="relative">
                  <div className="md:sticky md:top-36 bg-[#0A1F44] border border-white/10 rounded-sm p-10">
                    {isEditing && editingField === 'services.deliverables.kicker' ? (
                       <CMSEditor 
                          variant="ghost"
                          content={data.deliverablesKicker || "The Output"}
                          onChange={(val) => updateMetadata('deliverablesKicker', val)}
                          onDone={() => setEditingField(null)}
                       />
                    ) : (
                      <p 
                          className={cn("text-[10px] font-bold uppercase tracking-[0.2em] text-cyan mb-8", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                          onDoubleClick={() => setEditingField('services.deliverables.kicker')}
                          dangerouslySetInnerHTML={{ __html: data.deliverablesKicker || "The Output" }}
                      />
                    )}

                    {isEditing && editingField === 'services.deliverables.title' ? (
                       <div className="mb-10">
                          <CMSEditor 
                              variant="ghost"
                              content={data.deliverablesTitle || "Deliverables"}
                              onChange={(val) => updateMetadata('deliverablesTitle', val)}
                              onDone={() => setEditingField(null)}
                          />
                       </div>
                    ) : (
                      <h2 
                          className={cn("text-5xl text-white font-bold font-heading mb-10", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                          onDoubleClick={() => setEditingField('services.deliverables.title')}
                          dangerouslySetInnerHTML={{ __html: data.deliverablesTitle || "Deliverables" }}
                      />
                    )}

                    <ul className="space-y-6">
                      {deliverables.map((item: any, index: number) => (
                        <li key={index} className="flex gap-4 group">
                          <div className="w-1 h-auto bg-cyan opacity-20 group-hover:opacity-100 transition-opacity" />
                          <div className="py-1">
                            {isEditing && editingField === `deliverables.${index}.title` ? (
                              <CMSEditor 
                                variant="ghost"
                                content={item.title}
                                onChange={(val) => updateServiceArrayItem('deliverables', index, 'title', val)}
                                onDone={() => setEditingField(null)}
                              />
                            ) : (
                              <h3 
                                  className={cn("text-lg font-bold text-white mb-2", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                                  onDoubleClick={() => setEditingField(`deliverables.${index}.title`)}
                                  dangerouslySetInnerHTML={{ __html: item.title }}
                              />
                            )}

                            {isEditing && editingField === `deliverables.${index}.description` ? (
                              <CMSEditor 
                                variant="ghost"
                                content={item.description}
                                onChange={(val) => updateServiceArrayItem('deliverables', index, 'description', val)}
                                onDone={() => setEditingField(null)}
                              />
                            ) : (
                              <p 
                                  className={cn("text-sm text-slate opacity-70 leading-relaxed", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                                  onDoubleClick={() => setEditingField(`deliverables.${index}.description`)}
                                  dangerouslySetInnerHTML={{ __html: item.description }}
                              />
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {isContact && (
        <>
          <div className="section-divider" />
          <section className="bg-navy py-44 min-h-[60vh] flex items-center relative overflow-hidden" id="contact">
            {!isEditing && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-cyan/5 blur-[120px] rounded-full pointer-events-none" />
            )}
            <div className="container-main text-center relative z-10">
              <div className="max-w-4xl mx-auto space-y-16">
                <div className="flex flex-col items-center">
                   <div className="h-px w-12 bg-cyan mb-8" />
                   <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-cyan">Start a Conversation</p>
                </div>
                <div className="space-y-6">
                  {isEditing && editingField === 'contact.email' ? (
                     <CMSEditor 
                        variant="ghost"
                        content={data.email || 'bburke@bytestream.ca'}
                        onChange={(val) => updateMetadata('email', val)}
                        onDone={() => setEditingField(null)}
                      />
                  ) : (
                    <a 
                        href={`mailto:${data.email || 'bburke@bytestream.ca'}`}
                        className={cn("text-4xl md:text-7xl lg:text-8xl font-bold text-white hover:text-cyan transition-all duration-500 font-heading block tracking-tighter", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                        onDoubleClick={() => isEditing && setEditingField('contact.email')}
                    >
                        {data.email || 'bburke@bytestream.ca'}
                    </a>
                  )}
                </div>
                <div className="max-w-2xl mx-auto">
                  {isEditing && editingField === 'contact.subtext' ? (
                    <CMSEditor 
                      variant="ghost"
                      content={data.subtext || 'Whether you are working on AI governance architecture...'}
                      onChange={(val) => updateMetadata('subtext', val)}
                      onDone={() => setEditingField(null)}
                    />
                  ) : (
                    <p 
                        className={cn("text-xl text-slate opacity-80 leading-relaxed font-medium", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                        onDoubleClick={() => isEditing && setEditingField('contact.subtext')}
                        dangerouslySetInnerHTML={{ __html: data.subtext || 'Whether you are early in AI deployment or already hitting scaling friction, the Assessment provides immediate decision visibility.' }}
                    />
                  )}
                </div>
                <div className="pt-8">
                  {isEditing && editingField === 'contact.linkedin' ? (
                    <CMSEditor 
                      variant="ghost"
                      content={data.linkedin || 'https://www.linkedin.com/'}
                      onChange={(val) => updateMetadata('linkedin', val)}
                      onDone={() => setEditingField(null)}
                    />
                  ) : (
                    <p className="text-white/40 text-sm">
                        Find Brian on{' '}
                        <a
                            href={data.linkedin || 'https://www.linkedin.com/'}
                            target="_blank"
                            rel="noreferrer"
                            className={cn("text-cyan underline underline-offset-4 font-bold", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                            onDoubleClick={() => isEditing && setEditingField('contact.linkedin')}
                        >
                            LinkedIn
                        </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <div className="section-divider" />
      <CTASection 
        title={cta.title} 
        description={cta.description} 
        isEditing={isEditing} 
        onUpdate={updateCTA}
      />
    </div>
  )
}
