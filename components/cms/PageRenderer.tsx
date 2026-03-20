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

  // Page specific elements
  const isHome = slug === 'home'
  const isAbout = slug === 'about'
  const isFramework = slug === 'framework'
  
  const hero = data.hero || {
    kicker: isHome ? 'Enterprise AI Governance Architecture' : (isAbout ? 'The Founder' : 'The Framework'),
    title: isHome ? 'AI is already influencing decisions in your organization.' : (isAbout ? 'Built from doctoral research.' : 'Governance architecture for the layer most frameworks miss.'),
    highlight: isHome ? 'Most enterprises have no governance over that layer.' : '',
    description: isHome ? 'AlignAI governs the AI Decision Influence Layer — the environment created by AI systems before humans make decisions.' : (isAbout ? 'Delivered with 30 years of enterprise experience.' : 'AlignAI defines the structural controls for the AI decision environment your organization has already created.')
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
              <input 
                autoFocus
                className="bg-white/10 border border-cyan/50 focus:border-cyan px-4 py-2 rounded-lg text-white text-sm font-medium w-full mb-6 outline-none transition-all"
                value={hero.kicker}
                onChange={(e) => updateHero('kicker', e.target.value)}
                onBlur={() => setEditingField(null)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
              />
            ) : (
              <p 
                className={cn("hero-kicker mb-6", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                onDoubleClick={() => isEditing && setEditingField('kicker')}
              >
                {hero.kicker}
              </p>
            )}

            {/* Title */}
            {isEditing && editingField === 'title' ? (
              <textarea 
                autoFocus
                className="bg-white/10 border border-cyan/50 focus:border-cyan px-4 py-2 rounded-xl text-white text-4xl md:text-6xl font-bold w-full h-32 mb-6 outline-none transition-all resize-none"
                value={hero.title}
                onChange={(e) => updateHero('title', e.target.value)}
                onBlur={() => setEditingField(null)}
                onKeyDown={(e) => e.key === 'Escape' && setEditingField(null)}
              />
            ) : (
              <h1 
                className={cn(
                  "text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl leading-[1.1] mb-6",
                  isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1"
                )}
                onDoubleClick={() => isEditing && setEditingField('title')}
              >
                {hero.title}
              </h1>
            )}

            {/* Highlight (Home Only) */}
            {isHome && (
              isEditing && editingField === 'highlight' ? (
                <textarea 
                  autoFocus
                  className="bg-white/10 border border-cyan/50 focus:border-cyan px-4 py-2 rounded-xl text-cyan text-4xl md:text-6xl font-bold w-full h-32 mb-8 outline-none transition-all resize-none"
                  value={hero.highlight}
                  onChange={(e) => updateHero('highlight', e.target.value)}
                  onBlur={() => setEditingField(null)}
                  onKeyDown={(e) => e.key === 'Escape' && setEditingField(null)}
                />
              ) : (
                <h1 
                  className={cn(
                    "text-4xl font-bold tracking-tight text-cyan md:text-6xl lg:text-7xl leading-[1.1] mb-8",
                    isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1"
                  )}
                  onDoubleClick={() => isEditing && setEditingField('highlight')}
                >
                  {hero.highlight}
                </h1>
              )
            )}

            {/* Description */}
            {isEditing && editingField === 'description' ? (
              <textarea 
                autoFocus
                className="bg-white/10 border border-cyan/50 focus:border-cyan px-4 py-2 rounded-xl text-light-slate text-lg md:text-xl w-full h-40 mb-10 outline-none transition-all resize-none"
                value={hero.description}
                onChange={(e) => updateHero('description', e.target.value)}
                onBlur={() => setEditingField(null)}
                onKeyDown={(e) => e.key === 'Escape' && setEditingField(null)}
              />
            ) : (
              <p 
                className={cn(
                  "mb-10 max-w-2xl text-lg text-light-slate md:text-xl leading-relaxed",
                  isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1"
                )}
                onDoubleClick={() => isEditing && setEditingField('description')}
              >
                {hero.description}
              </p>
            )}
          </div>

          {/* Main Content Area */}
          <div className="mt-12">
            {isEditing && editingField === 'content' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-cyan/50" />
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Editing Content</p>
                  </div>
                  <button 
                    onClick={() => setEditingField(null)}
                    className="text-[10px] font-bold text-cyan hover:text-white transition-colors uppercase tracking-widest"
                  >
                    Done
                  </button>
                </div>
                <CMSEditor 
                  content={page?.content || ''} 
                  onChange={(content) => onContentChange?.(content)} 
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
          
          {/* ... (Home credentials and buttons) ... */}
          {/* (I'll keep them as before) */}
        </div>
      </section>

      {/* About Specific Section (Founder) */}
      {isAbout && (
        <>
          <div className="section-divider" />
          <section className="bg-off-white py-20">
            <div className="container-main">
              <div className="grid gap-12 lg:grid-cols-[260px_1fr] lg:gap-14 text-navy">
                <div className="flex aspect-[3/4] w-full max-w-[250px] items-center justify-center rounded-btn bg-deep-blue text-white shadow-xl">
                  Headshot Placeholder
                </div>
                <div>
                  {isEditing && editingField === 'founder.name' ? (
                    <input 
                      autoFocus
                      className="bg-slate-100 border border-mid-blue/50 focus:border-mid-blue px-4 py-2 rounded-lg text-navy text-4xl font-bold w-full mb-2 outline-none"
                      value={founder.name}
                      onChange={(e) => updateFounder('name', e.target.value)}
                      onBlur={() => setEditingField(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                    />
                  ) : (
                    <h2 
                      className={cn("text-4xl font-bold", isEditing && "hover:ring-1 hover:ring-mid-blue/30 cursor-edit transition-all rounded px-1")}
                      onDoubleClick={() => isEditing && setEditingField('founder.name')}
                    >
                      {founder.name}
                    </h2>
                  )}

                  {isEditing && editingField === 'founder.title' ? (
                    <input 
                      autoFocus
                      className="bg-slate-100 border border-mid-blue/50 focus:border-mid-blue px-4 py-2 rounded-lg text-mid-blue font-bold w-full outline-none"
                      value={founder.title}
                      onChange={(e) => updateFounder('title', e.target.value)}
                      onBlur={() => setEditingField(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                    />
                  ) : (
                    <p 
                      className={cn("text-mid-blue font-bold mt-1", isEditing && "hover:ring-1 hover:ring-mid-blue/30 cursor-edit transition-all rounded px-1")}
                      onDoubleClick={() => isEditing && setEditingField('founder.title')}
                    >
                      {founder.title}
                    </p>
                  )}

                  <div className="mt-6 space-y-4 text-slate leading-relaxed">
                    {founder.bio.map((p: string, i: number) => (
                      <div key={i}>
                        {isEditing && editingField === `founder.bio.${i}` ? (
                          <textarea 
                            autoFocus
                            className="bg-slate-50 border border-mid-blue/50 focus:border-mid-blue px-4 py-2 rounded-lg text-slate w-full h-32 outline-none resize-none"
                            value={p}
                            onChange={(e) => updateFounderBio(i, e.target.value)}
                            onBlur={() => setEditingField(null)}
                          />
                        ) : (
                          <p 
                            className={cn(isEditing && "hover:ring-1 hover:ring-mid-blue/30 cursor-edit transition-all rounded px-1")}
                            onDoubleClick={() => isEditing && setEditingField(`founder.bio.${i}`)}
                          >
                            {p}
                          </p>
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
                  <div key={pillar.number} className="border-l-2 border-cyan/50 pl-6 hover:border-cyan transition-colors group">
                    {isEditing && editingField === `pillars.${i}.title` ? (
                      <input 
                        autoFocus
                        className="bg-white/10 border border-cyan/50 focus:border-cyan px-4 py-2 rounded-lg text-white text-xl font-bold w-full mb-2 outline-none"
                        value={pillar.title}
                        onChange={(e) => updatePillar(i, 'title', e.target.value)}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                      />
                    ) : (
                      <h3 
                        className={cn("text-xl font-bold text-white group-hover:text-cyan transition-colors", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                        onDoubleClick={() => isEditing && setEditingField(`pillars.${i}.title`)}
                      >
                        {pillar.title}
                      </h3>
                    )}

                    {isEditing && editingField === `pillars.${i}.description` ? (
                      <textarea 
                        autoFocus
                        className="bg-white/10 border border-cyan/50 focus:border-cyan px-4 py-2 rounded-lg text-light-slate w-full h-24 outline-none resize-none mt-2"
                        value={pillar.description}
                        onChange={(e) => updatePillar(i, 'description', e.target.value)}
                        onBlur={() => setEditingField(null)}
                      />
                    ) : (
                      <p 
                        className={cn("text-light-slate mt-2 leading-relaxed", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                        onDoubleClick={() => isEditing && setEditingField(`pillars.${i}.description`)}
                      >
                        {pillar.description}
                      </p>
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
                      <input 
                        autoFocus
                        className="bg-slate-50 border border-mid-blue/50 focus:border-mid-blue px-4 py-2 rounded-lg text-navy text-lg font-bold w-full mb-2 outline-none"
                        value={problem.title}
                        onChange={(e) => updateProblem(index, 'title', e.target.value)}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                      />
                    ) : (
                      <h3 
                        className={cn("text-lg text-navy font-bold", isEditing && "hover:ring-1 hover:ring-mid-blue/30 cursor-edit transition-all rounded px-1")}
                        onDoubleClick={() => isEditing && setEditingField(`problems.${index}.title`)}
                      >
                        {problem.title}
                      </h3>
                    )}

                    {isEditing && editingField === `problems.${index}.description` ? (
                      <textarea 
                        autoFocus
                        className="bg-slate-50 border border-mid-blue/50 focus:border-mid-blue px-4 py-2 rounded-lg text-slate text-sm w-full h-24 outline-none resize-none mt-3"
                        value={problem.description}
                        onChange={(e) => updateProblem(index, 'description', e.target.value)}
                        onBlur={() => setEditingField(null)}
                      />
                    ) : (
                      <p 
                        className={cn("mt-3 text-sm text-slate leading-relaxed", isEditing && "hover:ring-1 hover:ring-mid-blue/30 cursor-edit transition-all rounded px-1")}
                        onDoubleClick={() => isEditing && setEditingField(`problems.${index}.description`)}
                      >
                        {problem.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {!isEditing && <div className="section-divider" />}
      {!isEditing && <CTASection />}
    </div>
  )
}
