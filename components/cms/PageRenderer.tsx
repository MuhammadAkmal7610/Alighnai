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
  const template = page?.template || (slug === 'home' ? 'home' : (slug === 'about' ? 'about' : (slug === 'framework' ? 'framework' : 'blank')))

  // Page specific elements
  const isHome = template === 'home'
  const isAbout = template === 'about'
  const isFramework = template === 'framework'
  const isBlank = template === 'blank'
  
  const hero = data.hero || {
    kicker: isHome ? 'Enterprise AI Governance Architecture' : (isAbout ? 'The Founder' : (isFramework ? 'The Framework' : 'New Page')),
    title: isHome ? 'AI is already influencing decisions in your organization.' : (isAbout ? 'Built from doctoral research.' : (isFramework ? 'Governance architecture for the layer most frameworks miss.' : 'Start building your new page content...')),
    highlight: isHome ? 'Most enterprises have no governance over that layer.' : '',
    description: isHome ? 'AlignAI governs the AI Decision Influence Layer — the environment created by AI systems before humans make decisions.' : (isAbout ? 'Delivered with 30 years of enterprise experience.' : (isFramework ? 'AlignAI defines the structural controls for the AI decision environment your organization has already created.' : 'Use the editor below to add your page description and content.'))
  }

  const problems = data.problems || []
  const credentials = data.credentials || []
  const founder = data.founder || {
    name: 'Brian Burke',
    title: 'AI Governance Architect · Founder, ByteStream Strategies Inc.',
    credentials: ["PhD", "MBA", "PMP", "30+ Years Enterprise"],
    bio: ["Brian Burke holds a PhD...", "AlignAI is the proprietary..."]
  }
  const pillars = data.pillars || []
  const modelLayers = data.modelLayers || []
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

  const [editingField, setEditingField] = useState<string | null>(null)

  return (
    <div className={cn("flex flex-col min-h-screen font-inter", isEditing ? "bg-slate-900/10" : "bg-navy")}>
      {/* Hero Section */}
      <section className={cn(
        "pt-28 pb-14 md:pt-32 md:pb-16 relative",
        (isHome || isAbout || isFramework) ? "hero-panel" : "bg-navy"
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
                dangerouslySetInnerHTML={{ __html: hero.kicker || (isHome ? 'Enterprise AI Governance Architecture' : (isAbout ? 'The Founder' : 'The Framework')) }}
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
                dangerouslySetInnerHTML={{ __html: hero.title || (isHome ? 'AI is already influencing decisions in your organization.' : (isAbout ? 'Built from doctoral research.' : 'Governance architecture for the layer most frameworks miss.')) }}
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
                  content={hero.description}
                  onChange={(val) => updateHero('description', val)}
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
                dangerouslySetInnerHTML={{ __html: hero.description || (isHome ? 'AlignAI governs the AI Decision Influence Layer — the environment created by AI systems before humans make decisions.' : (isAbout ? 'Delivered with 30 years of enterprise experience.' : 'AlignAI defines the structural controls for the AI decision environment your organization has already created.')) }}
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
              <p className="hero-kicker">Five Governance Pillars</p>
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
              <p className="hero-kicker text-mid-blue">The Governance Gap</p>
              <h2 className="mt-3 max-w-2xl text-4xl leading-tight text-navy md:text-5xl font-bold">
                Every major AI governance framework is focused on the wrong layer.
              </h2>
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
