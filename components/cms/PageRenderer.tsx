"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { CTASection } from "@/components/CTASection"
import { CMSEditor } from "./CMSEditor"
import { cn } from "@/lib/utils"
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Upload, 
  PlusCircle, 
  Layout, 
  ExternalLink,
  Settings,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InsightsPageView } from "@/components/site/InsightsPageView"

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
    : (slug === 'home' ? 'home' : (slug === 'about' ? 'about' : (slug === 'framework' ? 'framework' : (slug === 'services' ? 'services' : (slug === 'contact' ? 'contact' : (slug === 'insights' ? 'insights' : 'blank'))))))

  // Page specific elements
  const isHome = template === 'home'
  const isAbout = template === 'about'
  const isFramework = template === 'framework'
  const isServices = template === 'services'
  const isContact = template === 'contact'
  const isInsights = template === 'insights'
  const isBlank = template === 'blank'
  
  const hero = data.hero || {
    kicker: isHome ? 'Enterprise AI Governance Architecture' : (isAbout ? 'The Founder' : (isFramework ? 'The Framework' : (isServices ? 'The Entry Point' : (isContact ? 'ByteStream Strategies' : 'New Page')))),
    title: isHome ? 'AI is already influencing decisions in your organization.' : (isAbout ? 'Built from doctoral research.' : (isFramework ? 'Governance architecture for the layer most frameworks miss.' : (isServices ? 'The AI Decision Visibility <span class="block text-cyan">Assessment.</span>' : (isContact ? 'Start a conversation.' : 'Start building your new page content...')))),
    highlight: isHome ? 'Most enterprises have no governance over that layer.' : '',
    description: isHome ? 'AlignAI governs the AI Decision Influence Layer — the environment created by AI systems before humans make decisions. Built for enterprise. Grounded in doctoral research.' : (isAbout ? 'Delivered with 30 years of enterprise experience.' : (isFramework ? 'AlignAI defines the structural controls for the AI decision environment your organization has already created.' : (isServices ? 'A 4-6 week structured engagement covering one business domain.' : (isContact ? 'No forms, no demos, no sales calls.' : 'Use the editor below to add your page description and content.'))))
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
    description: 'No platform required. No prior governance work needed.',
    ctaButtonText: 'Start a conversation →',
    ctaButtonLink: '/site/contact'
  }

  const customSections = data.customSections || []
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  /** Contact copy: DB may store flat keys (seed) or nested under hero */
  const contactCopy = isContact
    ? {
        kicker: data.kicker ?? data.hero?.kicker ?? hero.kicker,
        title: data.title ?? data.hero?.title ?? hero.title,
        description:
          data.description ??
          data.hero?.description ??
          hero.description,
        email: data.email ?? "bburke@bytestream.ca",
        subtext:
          data.subtext ??
          "If you are working on AI governance architecture - or trying to understand whether you should be - this is the conversation to have. Reach out directly. No intake form, no scheduling tool, no SDR.",
        linkedin: data.linkedin ?? "https://www.linkedin.com/",
      }
    : null

  const patchContactMetadata = (updates: Record<string, string>) => {
    if (!onMetadataChange) return
    const existingHero =
      data.hero && typeof data.hero === "object" ? data.hero : {}
    onMetadataChange({
      ...data,
      ...updates,
      hero: { ...existingHero, ...updates },
    })
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

  const addCustomSection = () => {
    if (onMetadataChange) {
      const newSections = [...customSections, {
        title: 'New Section Title',
        content: '<p>Add your content here...</p>',
        type: 'text'
      }]
      onMetadataChange({
        ...data,
        customSections: newSections
      })
    }
  }

  const updateCustomSection = (index: number, field: string, value: string) => {
    if (onMetadataChange) {
      const newSections = [...customSections]
      newSections[index] = { ...newSections[index], [field]: value }
      onMetadataChange({
        ...data,
        customSections: newSections
      })
    }
  }

  const removeCustomSection = (index: number) => {
    if (onMetadataChange) {
      const newSections = customSections.filter((_: any, i: number) => i !== index)
      onMetadataChange({
        ...data,
        customSections: newSections
      })
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onMetadataChange) {
      setIsUploading(true)
      // In a real app, you'd upload to a server here
      // We'll simulate it with a local URL for the preview session
      const reader = new FileReader();
      reader.onloadend = () => {
        updateFounder('image', reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
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
    <div className={cn(
        "flex flex-col min-h-screen font-body dark-site-theme", 
        isEditing ? "bg-navy" : "bg-navy"
    )}>
      {/* Hero Section */}
      {template !== 'blank' && !isContact && !isInsights && (
        <section className={cn(
          "hero-panel relative",
          isServices ? "min-h-[72vh] pt-28 pb-16 md:min-h-[85vh] md:pt-36 md:pb-24" : "pt-28 pb-14 md:pt-32 md:pb-16",
          (isHome || isAbout || isFramework || isServices) ? "" : "bg-navy"
        )} id="hero">
        <div className="container-main relative z-10">
          {/* Decorative triangle: framework only — home uses .hero-panel::before in globals.css (avoids double triangle) */}
          {isFramework && !isEditing && (
            <div className="absolute top-0 right-0 w-[50%] h-full pointer-events-none overflow-hidden opacity-30">
               <div className="absolute bottom-0 right-[-5%] w-0 h-0 border-l-[600px] border-l-transparent border-b-[800px] border-b-deep-blue" />
            </div>
          )}

          <div className="max-w-4xl">
            {/* Kicker (shown on home too — matches live bytestream / ByteStream Strategies site) */}
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
                dangerouslySetInnerHTML={{ __html: hero.kicker || (isAbout ? 'The Founder' : (isFramework ? 'The Framework' : (isServices ? 'The Entry Point' : (isHome ? 'Enterprise AI Governance Architecture' : 'New Page')))) }}
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
                  isServices 
                    ? "mt-6 max-w-4xl text-4xl leading-[1.05] text-white sm:text-5xl md:text-[74px]" 
                    : "hero-title max-w-[900px] text-[32px] leading-[1.08] md:text-[66px]",
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
                <p 
                  className={cn(
                    "hero-highlight mt-2 max-w-[900px] text-[26px] leading-[1.12] md:text-[48px] md:max-w-[800px]",
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
              <p 
                className={cn(
                  isServices
                    ? "mt-8 max-w-prose text-[16px] leading-[1.7] text-light-slate"
                    : "mt-6 max-w-[540px] text-sm leading-snug text-light-slate md:text-base md:max-w-[530px]",
                  isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1"
                )}
                onDoubleClick={() => isEditing && setEditingField('description')}
                dangerouslySetInnerHTML={{ __html: (isServices ? data.heroDescription : hero.description) || (isHome ? 'AlignAI governs the AI Decision Influence Layer — the environment created by AI systems before humans make decisions.' : (isAbout ? 'Delivered with 30 years of enterprise experience.' : 'AlignAI defines the structural controls for the AI decision environment your organization has already created.')) }}
              />
            )}

            {/* Hero Buttons (from target site) */}
            {isHome && (
              <div className="flex flex-wrap gap-4 mt-12">
                {isEditing && editingField === 'hero-buttons' ? (
                  <div className="flex flex-col gap-3 p-6 bg-white/5 rounded-xl border border-white/10 w-full max-w-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white text-[10px] uppercase font-bold opacity-40">Button 1 Text</Label>
                        <Input 
                           value={data.heroBtn1Text || 'Explore the framework'} 
                           onChange={(e) => updateMetadata('heroBtn1Text', e.target.value)}
                           className="bg-navy text-white border-white/20 h-9"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white text-[10px] uppercase font-bold opacity-40">Button 1 Link</Label>
                        <Input 
                           value={data.heroBtn1Link || '/site/framework'} 
                           onChange={(e) => updateMetadata('heroBtn1Link', e.target.value)}
                           className="bg-navy text-white border-white/20 h-9"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="space-y-2">
                        <Label className="text-white text-[10px] uppercase font-bold opacity-40">Button 2 Text</Label>
                        <Input 
                           value={data.heroBtn2Text || 'Start a conversation'} 
                           onChange={(e) => updateMetadata('heroBtn2Text', e.target.value)}
                           className="bg-navy text-white border-white/20 h-9"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white text-[10px] uppercase font-bold opacity-40">Button 2 Link</Label>
                        <Input 
                           value={data.heroBtn2Link || '/site/contact'} 
                           onChange={(e) => updateMetadata('heroBtn2Link', e.target.value)}
                           className="bg-navy text-white border-white/20 h-9"
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={() => setEditingField(null)}
                      className="mt-4 bg-cyan text-navy font-bold hover:bg-white"
                    >
                      DONE
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link 
                      href={data.heroBtn1Link || "/site/framework"} 
                      className={cn(
                        "bg-mid-blue hover:bg-[#4a8cc8] text-white font-bold py-4 px-8 rounded-btn border border-[#34649e] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all flex items-center gap-2 group text-[15px] leading-tight tracking-normal",
                        isEditing && "hover:ring-2 hover:ring-white border border-transparent shadow-lg"
                      )}
                      onClick={(e) => {
                        if (isEditing) {
                          e.preventDefault();
                          setEditingField('hero-buttons');
                        }
                      }}
                    >
                      {data.heroBtn1Text || "Explore the framework"}
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                    <Link 
                      href={data.heroBtn2Link || "/site/contact"} 
                      className={cn(
                        "bg-transparent hover:bg-white/5 text-white border border-white/35 font-bold py-4 px-8 rounded-btn transition-all flex items-center gap-2 text-[15px] leading-tight tracking-normal",
                        isEditing && "hover:ring-2 hover:ring-white/50 border border-transparent shadow-lg"
                      )}
                      onClick={(e) => {
                        if (isEditing) {
                          e.preventDefault();
                          setEditingField('hero-buttons');
                        }
                      }}
                    >
                      {data.heroBtn2Text || "Start a conversation"}
                      <span>→</span>
                    </Link>
                  </>
                )}
              </div>
            )}
            
            {/* Founder Credentials (Home Only) */}
            {isHome && (
              <div className="mt-16 flex flex-wrap items-center gap-6">
                <span className="text-[10px] font-bold text-slate uppercase tracking-[0.2em] whitespace-nowrap">FOUNDER CREDENTIALS</span>
                {isEditing && editingField === 'hero-credentials' ? (
                  <div className="flex gap-2 p-2 bg-white/5 border border-white/10 rounded-sm">
                    <Input 
                      value={(data.credentials || ["PHD - CARLETON UNIVERSITY", "MBA - UNIVERSITY OF OTTAWA", "PMP CERTIFIED", "30+ YEARS ENTERPRISE"]).join(', ')}
                      onChange={(e) => updateMetadata('credentials', e.target.value.split(',').map(s => s.trim()))}
                      className="bg-navy text-white text-[10px] border-white/20 h-8 uppercase tracking-widest min-w-[400px]"
                      placeholder="Comma-separated credentials..."
                      autoFocus
                    />
                    <Button 
                      size="sm" 
                      onClick={() => setEditingField(null)}
                      className="h-8 bg-cyan text-navy font-bold hover:bg-white text-[10px]"
                    >
                      DONE
                    </Button>
                  </div>
                ) : (
                  <div 
                    className={cn(
                        "flex flex-wrap gap-2",
                        isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit p-1 rounded transition-all"
                    )}
                    onDoubleClick={() => isEditing && setEditingField('hero-credentials')}
                  >
                    {(data.credentials || ["PHD - CARLETON UNIVERSITY", "MBA - UNIVERSITY OF OTTAWA", "PMP CERTIFIED", "30+ YEARS ENTERPRISE"]).map((cred: string, i: number) => (
                      <div key={i} className="rounded-full border border-cyan/45 bg-white/[0.04] px-3 py-2 text-[10px] font-bold text-white uppercase tracking-widest whitespace-nowrap backdrop-blur-[2px]">
                        {cred}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          </div>
        </section>
      )}

      {isInsights && (
        <InsightsPageView
          metadata={data}
          isEditing={isEditing}
          onMetadataChange={onMetadataChange}
        />
      )}

      {/* Main Content Area (For Generic Pages) */}
      {template === 'blank' && (
        <section className="bg-navy pt-32 pb-20 min-h-screen border-t border-white/5">
          <div className="container-main max-w-4xl mx-auto">
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
                  "prose prose-invert max-w-none text-white/90 leading-relaxed",
                  isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded p-4 bg-navy/50"
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
        </section>
      )}

      {/* About Specific Section (Founder - Dark Minimalist) */}
      {isAbout && (
        <>
          <div className="section-divider" />
          <section className="bg-navy py-32 border-b border-white/5">
            <div className="container-main">
              <div className="grid gap-20 lg:grid-cols-[380px_1fr] lg:gap-24">
                <div className="relative group">
                  <div className="absolute inset-0 bg-cyan/10 translate-x-4 translate-y-4 rounded-sm transition-transform group-hover:translate-x-2 group-hover:translate-y-2" />
                  <div className="relative aspect-[3/4] w-full rounded-sm bg-[#0A1F44] border border-white/10 flex items-center justify-center overflow-hidden">
                    {founder.image ? (
                        <img 
                            src={founder.image} 
                            alt={founder.name} 
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-3 opacity-40">
                            <ImageIcon className="w-8 h-8 text-cyan" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">No Headshot</span>
                        </div>
                    )}
                    
                    {isEditing && (
                        <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center">
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleFileChange}
                            />
                            <Button 
                                onClick={handleUploadClick}
                                disabled={isUploading}
                                className="bg-cyan text-navy font-bold hover:bg-white mb-2"
                            >
                                {isUploading ? "UPLOADING..." : "UPLOAD NEW"}
                                <Upload className="ml-2 w-4 h-4" />
                            </Button>
                            <p className="text-[10px] text-white opacity-60 uppercase tracking-widest">Recommended: 3:4 Aspect Ratio</p>
                        </div>
                    )}
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

                  <div className="mt-12 space-y-8 text-white/80 text-lg leading-relaxed opacity-80">
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
          <section className="bg-off-white py-32">
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
                            className={cn("text-white/80 text-lg leading-relaxed max-w-2xl opacity-80", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
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
                    className={cn("hero-kicker text-mid-blue", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                    onDoubleClick={() => isEditing && setEditingField('home.gap.kicker')}
                    dangerouslySetInnerHTML={{ __html: data.gapKicker || "The Governance Gap" }}
                />
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
                    className={cn("mt-3 max-w-2xl text-4xl leading-tight text-navy md:text-5xl", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                    onDoubleClick={() => isEditing && setEditingField('home.gap.title')}
                    dangerouslySetInnerHTML={{ __html: data.gapTitle || "Every major AI governance framework is focused on the wrong layer." }}
                />
              )}
              
              <p className="mt-5 max-w-[600px] text-base text-slate">
                 NIST, ISO 42001, and the EU AI Act focus on models, training data, and compliance outputs. They do not govern where AI actually changes enterprise behavior.
              </p>

              <div className="mt-12 grid sm:grid-cols-2">
                {problems.map((problem: any, index: number) => (
                  <div key={index} className="border border-navy/[0.08] bg-white px-7 py-10 shadow-sm">
                    <div className="flex flex-col h-full">
                       <span className="mb-2 block text-xs font-medium tracking-wide text-light-slate">
                         {(index + 1).toString().padStart(2, "0")}
                       </span>
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
                          className={cn("text-lg text-navy", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
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
                          className={cn("mt-3 text-sm leading-relaxed text-slate", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
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
                       className={cn("hero-kicker text-mid-blue", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
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
                        className={cn("mt-4 text-2xl leading-tight text-navy", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                        onDoubleClick={() => isEditing && setEditingField('services.engagement.title')}
                        dangerouslySetInnerHTML={{ __html: data.engagementTitle || "A structured engagement. A standing deliverable." }}
                    />
                  )}

                  <div className="mt-6 flex flex-col gap-4">
                    {isEditing && editingField === 'engagement.desc1' ? (
                      <CMSEditor 
                        variant="ghost"
                        content={data.engagementDesc1 || "The Assessment is delivered through ByteStream Strategies. No platform required. No implementation prerequisite. Applicable regardless of what AI systems you currently use."}
                        onChange={(val) => updateMetadata('engagementDesc1', val)}
                        onDone={() => setEditingField(null)}
                      />
                    ) : (
                      <p 
                        className={cn("max-w-prose text-[15px] leading-relaxed text-slate", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
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
                        className={cn("max-w-prose text-[15px] leading-relaxed text-slate", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                        onDoubleClick={() => isEditing && setEditingField('engagement.desc2')}
                        dangerouslySetInnerHTML={{ __html: data.engagementDesc2 || "It stands alone as a governance diagnostic, or it becomes the foundation for broader architecture work under the AlignAI framework." }}
                      />
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
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
                            className={cn("rounded-btn border border-light-slate bg-mid-blue/5 px-3 py-1 text-xs font-medium text-slate", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all")}
                            onDoubleClick={() => isEditing && setEditingField(`tags.${i}`)}
                            dangerouslySetInnerHTML={{ __html: tag }}
                           />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <p className="hero-kicker mt-10 text-xl text-mid-blue">How It Works</p>
                    
                    <ol className="mt-6 border-light-slate">
                      {processSteps.map((step: any, index: number) => (
                        <li key={index} className={cn("border-light-slate py-5", index > 0 ? "border-t" : "")}>
                          <div className="flex gap-4">
                            <span className="mt-0.5 font-heading text-[18px] font-bold text-mid-blue">
                              {/* 01 */}
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
                                    className={cn("text-xl font-semibold text-navy", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                                    onDoubleClick={() => isEditing && setEditingField(`processSteps.${index}.title`)}
                                    dangerouslySetInnerHTML={{ __html: step.title }}
                                  />
                                )}

                                {isEditing && editingField === `processSteps.${index}.description` ? (
                                  <div className="mt-1 text-slate">
                                    <CMSEditor 
                                      variant="ghost"
                                      content={step.description}
                                      onChange={(val) => updateServiceArrayItem('processSteps', index, 'description', val)}
                                      onDone={() => setEditingField(null)}
                                    />
                                  </div>
                                ) : (
                                  <p 
                                    className={cn("mt-1 text-sm leading-relaxed text-slate", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
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
                </div>

                {/* Deliverables Column */}
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
                          className={cn("hero-kicker text-mid-blue", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                          onDoubleClick={() => setEditingField('services.deliverables.kicker')}
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
                          className={cn("mt-4 text-4xl text-navy", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                          onDoubleClick={() => setEditingField('services.deliverables.title')}
                          dangerouslySetInnerHTML={{ __html: data.deliverablesTitle || "Deliverables" }}
                      />
                    )}

                    <ul className="mt-6 space-y-1">
                      {deliverables.map((item: any, index: number) => (
                        <li key={index} className="grid grid-cols-[44px_1fr] gap-1 border-l-[3px] border-mid-blue bg-[#e9edf3] px-4 py-5">
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
                                  className={cn("text-xl font-semibold text-navy", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
                                  onDoubleClick={() => setEditingField(`deliverables.${index}.title`)}
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
                                  className={cn("mt-1 text-sm leading-relaxed text-slate", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-1")}
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
          </section>
        </>
      )}

      {isContact && contactCopy && (
        <section
          className="hero-panel flex min-h-screen items-center pt-16"
          id="contact"
        >
          <div className="container-main py-20 text-center">
            {isEditing && editingField === "contact.kicker" ? (
              <div className="flex justify-center">
                <CMSEditor
                  variant="ghost"
                  content={contactCopy.kicker}
                  onChange={(val) => patchContactMetadata({ kicker: val })}
                  onDone={() => setEditingField(null)}
                  placeholder="Kicker"
                />
              </div>
            ) : (
              <p
                className={cn(
                  "hero-kicker justify-center",
                  isEditing &&
                    "cursor-edit rounded px-1 transition-all hover:ring-1 hover:ring-cyan/30"
                )}
                onDoubleClick={() =>
                  isEditing && setEditingField("contact.kicker")
                }
                dangerouslySetInnerHTML={{ __html: contactCopy.kicker }}
              />
            )}

            {isEditing && editingField === "contact.title" ? (
              <div className="mx-auto mt-8 max-w-4xl">
                <CMSEditor
                  variant="ghost"
                  content={contactCopy.title}
                  onChange={(val) => patchContactMetadata({ title: val })}
                  onDone={() => setEditingField(null)}
                  placeholder="Headline"
                />
              </div>
            ) : (
              <h1
                className={cn(
                  "mt-8 text-4xl text-white md:text-6xl",
                  isEditing &&
                    "cursor-edit rounded px-1 transition-all hover:ring-1 hover:ring-cyan/30"
                )}
                onDoubleClick={() =>
                  isEditing && setEditingField("contact.title")
                }
                dangerouslySetInnerHTML={{ __html: contactCopy.title }}
              />
            )}

            {isEditing && editingField === "contact.description" ? (
              <div className="mx-auto mt-6 max-w-[520px]">
                <CMSEditor
                  variant="ghost"
                  content={contactCopy.description}
                  onChange={(val) => patchContactMetadata({ description: val })}
                  onDone={() => setEditingField(null)}
                  placeholder="Intro line"
                />
              </div>
            ) : (
              <p
                className={cn(
                  "mx-auto mt-6 max-w-[520px] text-lg leading-relaxed text-light-slate",
                  isEditing &&
                    "cursor-edit rounded px-1 transition-all hover:ring-1 hover:ring-cyan/30"
                )}
                onDoubleClick={() =>
                  isEditing && setEditingField("contact.description")
                }
                dangerouslySetInnerHTML={{ __html: contactCopy.description }}
              />
            )}

            {isEditing && editingField === "contact.email" ? (
              <div className="mx-auto mt-12 max-w-xl">
                <CMSEditor
                  variant="ghost"
                  content={contactCopy.email}
                  onChange={(val) => patchContactMetadata({ email: val })}
                  onDone={() => setEditingField(null)}
                  placeholder="Email address"
                />
              </div>
            ) : (
              <a
                href={isEditing ? "#" : `mailto:${contactCopy.email}`}
                className={cn(
                  "mt-12 inline-block border-b border-deep-blue pb-1 text-2xl font-semibold text-white transition-colors hover:text-cyan md:text-4xl",
                  isEditing &&
                    "cursor-edit rounded px-1 transition-all hover:ring-1 hover:ring-cyan/30"
                )}
                onClick={(e) => {
                  if (isEditing) {
                    e.preventDefault()
                    setEditingField("contact.email")
                  }
                }}
              >
                {contactCopy.email.replace(/<[^>]+>/g, "")}
              </a>
            )}

            {isEditing && editingField === "contact.subtext" ? (
              <div className="mx-auto mt-14 max-w-[520px]">
                <CMSEditor
                  variant="ghost"
                  content={contactCopy.subtext}
                  onChange={(val) => patchContactMetadata({ subtext: val })}
                  onDone={() => setEditingField(null)}
                  placeholder="Body copy"
                />
              </div>
            ) : (
              <p
                className={cn(
                  "mx-auto mt-14 max-w-[520px] text-[15px] leading-[1.8] text-light-slate",
                  isEditing &&
                    "cursor-edit rounded px-1 transition-all hover:ring-1 hover:ring-cyan/30"
                )}
                onDoubleClick={() =>
                  isEditing && setEditingField("contact.subtext")
                }
                dangerouslySetInnerHTML={{ __html: contactCopy.subtext }}
              />
            )}

            <div className="mt-10 text-[15px] text-light-slate">
              {isEditing && editingField === "contact.linkedin" ? (
                <div className="mx-auto max-w-xl">
                  <CMSEditor
                    variant="ghost"
                    content={contactCopy.linkedin}
                    onChange={(val) => patchContactMetadata({ linkedin: val })}
                    onDone={() => setEditingField(null)}
                    placeholder="LinkedIn URL"
                  />
                </div>
              ) : (
                <>
                  You can also find Brian on{" "}
                  <a
                    href={contactCopy.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "text-mid-blue underline decoration-mid-blue/60 underline-offset-2 hover:text-white",
                      isEditing &&
                        "cursor-edit rounded px-0.5 hover:ring-1 hover:ring-cyan/30"
                    )}
                    onClick={(e) => {
                      if (isEditing) {
                        e.preventDefault()
                        setEditingField("contact.linkedin")
                      }
                    }}
                  >
                    LinkedIn
                  </a>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Custom Sections */}
      {customSections.map((section: any, idx: number) => (
        <section key={idx} className="bg-navy py-24 relative border-b border-white/5 group">
           {isEditing && (
             <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                   variant="ghost" 
                   size="sm" 
                   onClick={() => removeCustomSection(idx)}
                   className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                >
                   <Trash2 className="w-4 h-4 mr-1" />
                   REMOVE SECTION
                </Button>
             </div>
           )}
           <div className="container-main">
              {isEditing && editingField === `custom.${idx}.title` ? (
                 <div className="mb-8 flex flex-col gap-3 p-6 bg-white/5 border border-white/10 rounded-2xl animate-in fade-in slide-in-from-top-2">
                     <Label className="text-cyan text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">Define Section Title</Label>
                     <div className="flex gap-2">
                        <Input 
                            value={section.title.replace(/<\/?[^>]+(>|$)/g, "")} 
                            onChange={(e) => updateCustomSection(idx, 'title', e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                            className="bg-navy border-white/10 text-white font-heading text-2xl h-14 focus:ring-cyan focus:border-cyan rounded-sm flex-1"
                            autoFocus
                        />
                        <Button 
                            onClick={() => setEditingField(null)}
                            className="bg-cyan text-navy font-bold hover:bg-white h-14 px-10 rounded-sm uppercase tracking-widest text-[10px] transition-all"
                        >
                            DONE
                        </Button>
                     </div>
                 </div>
               ) : (
                 <h2 
                     className={cn("text-3xl font-bold text-white font-heading mb-8 group/title flex items-center gap-4", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit px-2 py-1 rounded transition-all")}
                     onClick={() => isEditing && setEditingField(`custom.${idx}.title`)}
                 >
                     {section.title.replace(/<\/?[^>]+(>|$)/g, "") || "Untitled Section"}
                     {isEditing && (
                        <span className="text-[10px] font-bold text-cyan opacity-0 group-hover/title:opacity-100 uppercase tracking-widest transition-opacity">
                          (Click to Edit Title)
                        </span>
                     )}
                 </h2>
               )}

              {isEditing && editingField === `custom.${idx}.content` ? (
                 <div className="p-1 bg-white/5 rounded-2xl border border-white/10">
                    <CMSEditor 
                        variant="full"
                        content={section.content}
                        onChange={(val) => updateCustomSection(idx, 'content', val)}
                        onDone={() => setEditingField(null)}
                    />
                 </div>
               ) : (
                <div 
                    className={cn("prose prose-invert max-w-none text-white/80 text-lg", isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit p-4 rounded-lg bg-white/5")}
                    onClick={() => isEditing && setEditingField(`custom.${idx}.content`)}
                    dangerouslySetInnerHTML={{ __html: section.content }}
                />
              )}
           </div>
        </section>
      ))}

      {/* Add Section Button (Editor Only) */}
      {isEditing && (
        <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/10 mx-6 rounded-3xl mt-12 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
            <PlusCircle className="w-12 h-12 text-cyan mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-bold text-xl mb-2">Build your page further</h3>
            <p className="text-slate/60 text-sm mb-8 max-w-sm text-center">Add new custom sections to expand this page's architecture and content.</p>
            <Button 
                onClick={addCustomSection}
                className="bg-cyan text-navy font-bold hover:bg-white px-8 h-12 rounded-sm uppercase tracking-widest shadow-xl"
            >
                <Plus className="w-5 h-5 mr-2" />
                ADD NEW SECTION
            </Button>
        </div>
      )}

      {!isContact && (
        <>
          {!isInsights && <div className="section-divider" />}
          <CTASection />
        </>
      )}
    </div>
  )
}
