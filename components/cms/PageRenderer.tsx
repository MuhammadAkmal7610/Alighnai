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
    <div className={cn("flex flex-col min-h-screen font-inter", isEditing ? "bg-slate-900/10" : "bg-navy")}>
      {/* Hero Section */}
      <section className={cn(
        "pt-28 pb-14 md:pt-32 md:pb-16 relative",
        (isHome || isAbout || isFramework || isServices) ? "hero-panel" : "bg-navy"
      )}>
        <div className="container-main relative z-10">
          {isEditing && (
            <div className="mb-6 flex items-center justify-between bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 max-w-max">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-cyan animate-pulse" />
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Double-click any text to edit</span>
              </div>
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
                className={cn("hero-kicker mb-6", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                onDoubleClick={() => isEditing && setEditingField('kicker')}
                dangerouslySetInnerHTML={{ __html: hero.kicker || (isHome ? 'Enterprise AI Governance Architecture' : (isAbout ? 'The Founder' : (isFramework ? 'The Framework' : (isServices ? 'The Entry Point' : 'New Page')))) }}
              />
            )}

            {/* Title */}
            {isEditing && editingField === 'title' ? (
              <div className="mb-6">
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
                  "text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl leading-[1.1] mb-6",
                  isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1"
                )}
                onDoubleClick={() => isEditing && setEditingField('title')}
                dangerouslySetInnerHTML={{ __html: hero.title || (isHome ? 'AI is already influencing decisions in your organization.' : (isAbout ? 'Built from doctoral research.' : (isFramework ? 'Governance architecture for the layer most frameworks miss.' : (isServices ? 'The AI Decision Visibility <span class="block text-cyan">Assessment.</span>' : 'Start building your new page title...')))) }}
              />
            )}

            {/* Highlight (Home Only) */}
            {isHome && (
              isEditing && editingField === 'highlight' ? (
                <div className="mb-8">
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
                    "text-4xl font-bold tracking-tight text-cyan md:text-6xl lg:text-7xl leading-[1.1] mb-8",
                    isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1"
                  )}
                  onDoubleClick={() => isEditing && setEditingField('highlight')}
                  dangerouslySetInnerHTML={{ __html: hero.highlight || 'Most enterprises have no governance over that layer.' }}
                />
              )
            )}

            {/* Description */}
            {isEditing && editingField === 'description' ? (
              <div className="mb-10">
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
                  "mb-10 max-w-2xl text-lg text-light-slate md:text-xl leading-relaxed",
                  isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1"
                )}
                onDoubleClick={() => isEditing && setEditingField('description')}
                dangerouslySetInnerHTML={{ __html: (isServices ? data.heroDescription : hero.description) || (isHome ? 'AlignAI governs the AI Decision Influence Layer — the environment created by AI systems before humans make decisions.' : (isAbout ? 'Delivered with 30 years of enterprise experience.' : 'AlignAI defines the structural controls for the AI decision environment your organization has already created.')) }}
              />
            )}
          </div>

          {/* Main Content Area */}
          <div className="mt-12">
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
                  "prose prose-invert max-w-none text-light-slate leading-relaxed",
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

      {/* About Specific Section (Founder) */}
      {isAbout && (
        <>
          <div className="section-divider" />
          <section className="bg-off-white py-20">
            <div className="container-main text-navy">
              <div className="grid gap-12 lg:grid-cols-[260px_1fr] lg:gap-14">
                <div className="flex aspect-[3/4] w-full max-w-[250px] items-center justify-center rounded-btn bg-deep-blue text-white shadow-xl">
                  Headshot Placeholder
                </div>
                <div>
                  {isEditing && editingField === 'founder.name' ? (
                    <div className="mb-4">
                      <CMSEditor 
                        variant="ghost"
                        content={founder.name}
                        onChange={(val) => updateFounder('name', val)}
                        onDone={() => setEditingField(null)}
                        placeholder="Enter name..."
                      />
                    </div>
                  ) : (
                    <h2 
                      className={cn("text-4xl font-bold", isEditing && "hover:ring-1 hover:ring-mid-blue/30 cursor-edit transition-all rounded px-1")}
                      onDoubleClick={() => isEditing && setEditingField('founder.name')}
                      dangerouslySetInnerHTML={{ __html: founder.name }}
                    />
                  )}

                  {isEditing && editingField === 'founder.title' ? (
                    <div className="mb-4">
                      <CMSEditor 
                        variant="ghost"
                        content={founder.title}
                        onChange={(val) => updateFounder('title', val)}
                        onDone={() => setEditingField(null)}
                        placeholder="Enter title..."
                      />
                    </div>
                  ) : (
                    <p 
                      className={cn("text-mid-blue font-bold mt-1", isEditing && "hover:ring-1 hover:ring-mid-blue/30 cursor-edit transition-all rounded px-1")}
                      onDoubleClick={() => isEditing && setEditingField('founder.title')}
                      dangerouslySetInnerHTML={{ __html: founder.title }}
                    />
                  )}

                  <div className="mt-6 space-y-4 text-slate leading-relaxed">
                    {founder.bio.map((p: string, i: number) => (
                      <div key={i}>
                        {isEditing && editingField === `founder.bio.${i}` ? (
                          <div className="mb-4">
                            <CMSEditor 
                              variant="ghost"
                              content={p}
                              onChange={(val) => updateFounderBio(i, val)}
                              onDone={() => setEditingField(null)}
                              placeholder="Enter bio paragraph..."
                            />
                          </div>
                        ) : (
                          <div 
                            className={cn(isEditing && "hover:ring-1 hover:ring-mid-blue/30 cursor-edit transition-all rounded px-1")}
                            onDoubleClick={() => isEditing && setEditingField(`founder.bio.${i}`)}
                            dangerouslySetInnerHTML={{ __html: p }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Framework Specific Sections (Pillars & Model) */}
      {isFramework && (
        <>
          <div className="section-divider" />
          <section className="bg-navy py-20">
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
                    className={cn("hero-kicker", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                    onDoubleClick={() => isEditing && setEditingField('pillars.kicker')}
                    dangerouslySetInnerHTML={{ __html: data.pillarsKicker || "Five Governance Pillars" }}
                />
              )}
              <div className="mt-12 space-y-8">
                {pillars.map((pillar: any, i: number) => (
                  <div key={pillar.number || i} className="border-l-2 border-cyan/50 pl-6 hover:border-cyan transition-colors group">
                    {isEditing && editingField === `pillars.${i}.title` ? (
                      <div className="mb-2">
                        <CMSEditor 
                          variant="ghost"
                          content={pillar.title}
                          onChange={(val) => updatePillar(i, 'title', val)}
                          onDone={() => setEditingField(null)}
                          placeholder="Enter pillar title..."
                        />
                      </div>
                    ) : (
                      <h3 
                        className={cn("text-xl font-bold text-white group-hover:text-cyan transition-colors", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                        onDoubleClick={() => isEditing && setEditingField(`pillars.${i}.title`)}
                        dangerouslySetInnerHTML={{ __html: pillar.title }}
                      />
                    )}

                    {isEditing && editingField === `pillars.${i}.description` ? (
                      <div className="mt-2">
                        <CMSEditor 
                          variant="ghost"
                          content={pillar.description}
                          onChange={(val) => updatePillar(i, 'description', val)}
                          onDone={() => setEditingField(null)}
                          placeholder="Enter pillar description..."
                        />
                      </div>
                    ) : (
                      <div 
                        className={cn("text-light-slate mt-2 leading-relaxed", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                        onDoubleClick={() => isEditing && setEditingField(`pillars.${i}.description`)}
                        dangerouslySetInnerHTML={{ __html: pillar.description }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Home Specific Section (Governance Gap) */}
      {isHome && (
        <>
          <div className="section-divider" />
          <section className="bg-off-white py-20">
            <div className="container-main">
              {isEditing && editingField === 'home.gap.kicker' ? (
                <CMSEditor 
                   variant="ghost"
                   content={data.gapKicker || "The Governance Gap"}
                   onChange={(val) => updateMetadata('gapKicker', val)}
                   onDone={() => setEditingField(null)}
                />
              ) : (
                <p 
                    className={cn("hero-kicker text-mid-blue", isEditing && "hover:ring-1 hover:ring-mid-blue/30 cursor-edit transition-all rounded px-1")}
                    onDoubleClick={() => isEditing && setEditingField('home.gap.kicker')}
                    dangerouslySetInnerHTML={{ __html: data.gapKicker || "The Governance Gap" }}
                />
              )}

              {isEditing && editingField === 'home.gap.title' ? (
                <div className="mt-3 max-w-2xl">
                    <CMSEditor 
                    variant="ghost"
                    content={data.gapTitle || "Every major AI governance framework is focused on the wrong layer."}
                    onChange={(val) => updateMetadata('gapTitle', val)}
                    onDone={() => setEditingField(null)}
                    />
                </div>
              ) : (
                <h2 
                    className={cn("mt-3 max-w-2xl text-4xl leading-tight text-navy md:text-5xl font-bold", isEditing && "hover:ring-1 hover:ring-mid-blue/30 cursor-edit transition-all rounded px-1")}
                    onDoubleClick={() => isEditing && setEditingField('home.gap.title')}
                    dangerouslySetInnerHTML={{ __html: data.gapTitle || "Every major AI governance framework is focused on the wrong layer." }}
                />
              )}
              <div className="mt-12 grid sm:grid-cols-2 gap-6">
                {problems.map((problem: any, index: number) => (
                  <div key={index} className="bg-white p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-xl">
                    {isEditing && editingField === `problems.${index}.title` ? (
                      <div className="mb-2">
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
                        className={cn("text-lg text-navy font-bold", isEditing && "hover:ring-1 hover:ring-mid-blue/30 cursor-edit transition-all rounded px-1")}
                        onDoubleClick={() => isEditing && setEditingField(`problems.${index}.title`)}
                        dangerouslySetInnerHTML={{ __html: problem.title }}
                      />
                    )}

                    {isEditing && editingField === `problems.${index}.description` ? (
                      <div className="mt-3">
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
                        className={cn("mt-3 text-sm text-slate leading-relaxed", isEditing && "hover:ring-1 hover:ring-mid-blue/30 cursor-edit transition-all rounded px-1")}
                        onDoubleClick={() => isEditing && setEditingField(`problems.${index}.description`)}
                        dangerouslySetInnerHTML={{ __html: problem.description }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Services Specific Section (Process & Deliverables) */}
      {isServices && (
        <>
          <div className="section-divider" />
          <section className="bg-off-white py-20">
            <div className="container-main">
              <div className="grid gap-16 lg:grid-cols-2 lg:gap-14">
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
                    <p 
                        className={cn("hero-kicker text-mid-blue", isEditing && "hover:ring-1 hover:ring-mid-blue/30 cursor-edit transition-all rounded px-1")}
                        onDoubleClick={() => isEditing && setEditingField('services.engagement.kicker')}
                        dangerouslySetInnerHTML={{ __html: data.engagementKicker || "The Engagement" }}
                    />
                  )}

                  {isEditing && editingField === 'services.engagement.title' ? (
                     <div className="mt-4">
                        <CMSEditor 
                            variant="ghost"
                            content={data.engagementTitle || "A structured engagement. A standing deliverable."}
                            onChange={(val) => updateMetadata('engagementTitle', val)}
                            onDone={() => setEditingField(null)}
                        />
                     </div>
                  ) : (
                    <h2 
                        className={cn("mt-4 text-2xl leading-tight text-navy font-bold", isEditing && "hover:ring-1 hover:ring-mid-blue/30 cursor-edit transition-all rounded px-1")}
                        onDoubleClick={() => isEditing && setEditingField('services.engagement.title')}
                        dangerouslySetInnerHTML={{ __html: data.engagementTitle || "A structured engagement. A standing deliverable." }}
                    />
                  )}

                  <div className="mt-6 max-w-prose space-y-4 text-[15px] leading-relaxed text-slate">
                    {isEditing && editingField === 'engagement.desc1' ? (
                      <CMSEditor 
                        variant="ghost"
                        content={data.engagementDesc1 || "The Assessment is delivered through ByteStream Strategies. No platform required. No implementation prerequisite. Applicable regardless of what AI systems you currently use."}
                        onChange={(val) => updateMetadata('engagementDesc1', val)}
                        onDone={() => setEditingField(null)}
                      />
                    ) : (
                      <p 
                        className={cn(isEditing && "hover:ring-1 hover:ring-mid-blue/30 cursor-edit transition-all rounded px-1")}
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
                        className={cn(isEditing && "hover:ring-1 hover:ring-mid-blue/30 cursor-edit transition-all rounded px-1")}
                        onDoubleClick={() => isEditing && setEditingField('engagement.desc2')}
                        dangerouslySetInnerHTML={{ __html: data.engagementDesc2 || "It stands alone as a governance diagnostic, or it becomes the foundation for broader architecture work under the AlignAI framework." }}
                      />
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2 mb-10">
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
                            placeholder="Tag..."
                          />
                        ) : (
                           <span 
                            className={cn("rounded-btn border border-light-slate bg-mid-blue/5 px-3 py-1 text-xs font-medium text-slate", isEditing && "hover:ring-1 hover:ring-mid-blue/30 cursor-edit transition-all")}
                            onDoubleClick={() => isEditing && setEditingField(`tags.${i}`)}
                            dangerouslySetInnerHTML={{ __html: tag }}
                           />
                        )}
                      </div>
                    ))}
                  </div>

                  {isEditing && editingField === 'services.how.kicker' ? (
                     <CMSEditor 
                        variant="ghost"
                        content={data.howItWorksKicker || "How It Works"}
                        onChange={(val) => updateMetadata('howItWorksKicker', val)}
                        onDone={() => setEditingField(null)}
                     />
                  ) : (
                    <p 
                        className={cn("hero-kicker mt-10 text-xl text-mid-blue", isEditing && "hover:ring-1 hover:ring-mid-blue/30 cursor-edit transition-all rounded px-1")}
                        onDoubleClick={() => isEditing && setEditingField('services.how.kicker')}
                        dangerouslySetInnerHTML={{ __html: data.howItWorksKicker || "How It Works" }}
                    />
                  )}
                  <ol className="mt-6 border-light-slate">
                    {processSteps.map((step: any, index: number) => (
                      <li key={index} className={`border-light-slate py-5 ${index > 0 ? "border-t" : ""}`}>
                        <div className="flex gap-4">
                          <span className="mt-0.5 font-heading text-[18px] font-bold text-mid-blue">
                            {(index + 1).toString().padStart(2, "0")}
                          </span>
                          <div>
                            {isEditing && editingField === `processSteps.${index}.title` ? (
                              <div className="mb-2">
                                <CMSEditor 
                                  variant="ghost"
                                  content={step.title}
                                  onChange={(val) => updateServiceArrayItem('processSteps', index, 'title', val)}
                                  onDone={() => setEditingField(null)}
                                  placeholder="Step title..."
                                />
                              </div>
                            ) : (
                              <h3 
                                className={cn("text-xl font-semibold text-navy", isEditing && "hover:ring-1 hover:ring-mid-blue/30 cursor-edit transition-all rounded px-1")}
                                onDoubleClick={() => isEditing && setEditingField(`processSteps.${index}.title`)}
                                dangerouslySetInnerHTML={{ __html: step.title }}
                              />
                            )}

                            {isEditing && editingField === `processSteps.${index}.description` ? (
                              <div className="mt-1">
                                <CMSEditor 
                                  variant="ghost"
                                  content={step.description}
                                  onChange={(val) => updateServiceArrayItem('processSteps', index, 'description', val)}
                                  onDone={() => setEditingField(null)}
                                />
                              </div>
                            ) : (
                              <p 
                                className={cn("mt-1 text-sm leading-relaxed text-slate", isEditing && "hover:ring-1 hover:ring-mid-blue/30 cursor-edit transition-all rounded px-1")}
                                onDoubleClick={() => isEditing && setEditingField(`processSteps.${index}.description`)}
                                dangerouslySetInnerHTML={{ __html: step.description }}
                              />
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Deliverables */}
                <div>
                  {isEditing && editingField === 'services.deliverables.kicker' ? (
                     <CMSEditor 
                        variant="ghost"
                        content={data.deliverablesKicker || "Five Deliverables"}
                        onChange={(val) => updateMetadata('deliverablesKicker', val)}
                        onDone={() => setEditingField(null)}
                     />
                  ) : (
                    <p 
                        className={cn("hero-kicker text-mid-blue", isEditing && "hover:ring-1 hover:ring-mid-blue/30 cursor-edit transition-all rounded px-1")}
                        onDoubleClick={() => isEditing && setEditingField('services.deliverables.kicker')}
                        dangerouslySetInnerHTML={{ __html: data.deliverablesKicker || "Five Deliverables" }}
                    />
                  )}

                  {isEditing && editingField === 'services.deliverables.title' ? (
                     <div className="mt-4">
                        <CMSEditor 
                            variant="ghost"
                            content={data.deliverablesTitle || "Deliverables"}
                            onChange={(val) => updateMetadata('deliverablesTitle', val)}
                            onDone={() => setEditingField(null)}
                        />
                     </div>
                  ) : (
                    <h2 
                        className={cn("mt-4 text-4xl text-navy font-bold", isEditing && "hover:ring-1 hover:ring-mid-blue/30 cursor-edit transition-all rounded px-1")}
                        onDoubleClick={() => isEditing && setEditingField('services.deliverables.title')}
                        dangerouslySetInnerHTML={{ __html: data.deliverablesTitle || "Deliverables" }}
                    />
                  )}
                  <ul className="mt-6 space-y-1">
                    {deliverables.map((item: any, index: number) => (
                      <li
                        key={index}
                        className="grid grid-cols-[44px_1fr] gap-1 border-l-[3px] border-mid-blue bg-[#e9edf3] px-4 py-5"
                      >
                        <span className="pt-0.5 text-xs font-semibold text-mid-blue">
                          {(index + 1).toString().padStart(2, "0")}
                        </span>
                        <div>
                          {isEditing && editingField === `deliverables.${index}.title` ? (
                            <CMSEditor 
                              variant="ghost"
                              content={item.title}
                              onChange={(val) => updateServiceArrayItem('deliverables', index, 'title', val)}
                              onDone={() => setEditingField(null)}
                            />
                          ) : (
                            <h3 
                                className={cn("text-xl font-semibold text-navy", isEditing && "hover:ring-1 hover:ring-mid-blue/30 cursor-edit transition-all rounded px-1")}
                                onDoubleClick={() => isEditing && setEditingField(`deliverables.${index}.title`)}
                                dangerouslySetInnerHTML={{ __html: item.title }}
                            />
                          )}

                          {isEditing && editingField === `deliverables.${index}.description` ? (
                            <div className="mt-1">
                                <CMSEditor 
                                  variant="ghost"
                                  content={item.description}
                                  onChange={(val) => updateServiceArrayItem('deliverables', index, 'description', val)}
                                  onDone={() => setEditingField(null)}
                                />
                            </div>
                          ) : (
                            <p 
                                className={cn("mt-1 text-sm leading-relaxed text-slate", isEditing && "hover:ring-1 hover:ring-mid-blue/30 cursor-edit transition-all rounded px-1")}
                                onDoubleClick={() => isEditing && setEditingField(`deliverables.${index}.description`)}
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
          </section>
        </>
      )}

      {/* Contact Specific Section */}
      {isContact && (
        <>
          <div className="section-divider" />
          <section className="bg-navy py-20 min-h-[40vh] flex items-center">
            <div className="container-main text-center">
              <div className="max-w-3xl mx-auto space-y-12">
                {/* Email Display */}
                <div className="space-y-4">
                  <p className="text-cyan text-xs font-bold uppercase tracking-[0.2em]">Primary Contact</p>
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
                        className={cn("text-3xl md:text-5xl font-bold text-white hover:text-cyan transition-colors", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                        onDoubleClick={() => isEditing && setEditingField('contact.email')}
                    >
                        {data.email || 'bburke@bytestream.ca'}
                    </a>
                  )}
                </div>

                {/* Subtext */}
                <div className="space-y-4">
                  {isEditing && editingField === 'contact.subtext' ? (
                    <div className="max-w-2xl mx-auto">
                      <CMSEditor 
                        variant="ghost"
                        content={data.subtext || 'If you are working on AI governance architecture...'}
                        onChange={(val) => updateMetadata('subtext', val)}
                        onDone={() => setEditingField(null)}
                      />
                    </div>
                  ) : (
                    <p 
                        className={cn("text-light-slate text-lg leading-relaxed max-w-2xl mx-auto", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                        onDoubleClick={() => isEditing && setEditingField('contact.subtext')}
                        dangerouslySetInnerHTML={{ __html: data.subtext || "If you are working on AI governance architecture - or trying to understand whether you should be - this is the conversation to have." }}
                    />
                  )}
                </div>

                {/* LinkedIn Link */}
                <div className="pt-6 border-t border-white/5">
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
                            className={cn("text-mid-blue underline decoration-mid-blue/30 underline-offset-4", isEditing && "hover:ring-1 hover:ring-mid-blue/30 cursor-edit transition-all rounded px-1")}
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
