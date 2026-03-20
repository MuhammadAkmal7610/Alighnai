"use client"

import { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import CharacterCount from '@tiptap/extension-character-count'
import { Button } from '@/components/ui/button'
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon,
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Heading1, 
  Heading2,
  Code,
  Link as LinkIcon,
  Eraser
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CMSEditorProps {
  content: string
  onChange: (content: string) => void
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null
  }

  const addLink = () => {
    const url = window.prompt('URL')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-white border-b border-slate-200 rounded-t-lg sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            "h-8 w-8 p-0 transition-all",
            editor.isActive('bold') 
              ? 'bg-navy text-white hover:bg-navy/90' 
              : 'text-slate-700 hover:bg-slate-100'
          )}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            "h-8 w-8 p-0 transition-all",
            editor.isActive('italic') 
              ? 'bg-navy text-white hover:bg-navy/90' 
              : 'text-slate-700 hover:bg-slate-100'
          )}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn(
            "h-8 w-8 p-0 transition-all",
            editor.isActive('underline') 
              ? 'bg-navy text-white hover:bg-navy/90' 
              : 'text-slate-700 hover:bg-slate-100'
          )}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(
            "h-8 w-8 p-0 transition-all",
            editor.isActive('heading', { level: 1 }) 
              ? 'bg-navy text-white hover:bg-navy/90' 
              : 'text-slate-700 hover:bg-slate-100'
          )}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            "h-8 w-8 p-0 transition-all",
            editor.isActive('heading', { level: 2 }) 
              ? 'bg-navy text-white hover:bg-navy/90' 
              : 'text-slate-700 hover:bg-slate-100'
          )}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "h-8 w-8 p-0 transition-all",
            editor.isActive('bulletList') 
              ? 'bg-navy text-white hover:bg-navy/90' 
              : 'text-slate-700 hover:bg-slate-100'
          )}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "h-8 w-8 p-0 transition-all",
            editor.isActive('orderedList') 
              ? 'bg-navy text-white hover:bg-navy/90' 
              : 'text-slate-700 hover:bg-slate-100'
          )}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            "h-8 w-8 p-0 transition-all",
            editor.isActive('blockquote') 
              ? 'bg-navy text-white hover:bg-navy/90' 
              : 'text-slate-700 hover:bg-slate-100'
          )}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn(
            "h-8 w-8 p-0 transition-all",
            editor.isActive('codeBlock') 
              ? 'bg-navy text-white hover:bg-navy/90' 
              : 'text-slate-700 hover:bg-slate-100'
          )}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addLink}
          className={cn(
            "h-8 w-8 p-0 transition-all",
            editor.isActive('link') 
              ? 'bg-navy text-white hover:bg-navy/90' 
              : 'text-slate-700 hover:bg-slate-100'
          )}
          title="Add Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          className="h-8 w-8 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
          title="Clear Formatting"
        >
          <Eraser className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1" />
      
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          className="h-8 w-8 p-0 text-slate-400 hover:text-navy hover:bg-slate-100"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          className="h-8 w-8 p-0 text-slate-400 hover:text-navy hover:bg-slate-100"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export const CMSEditor = ({ content, onChange }: CMSEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-mid-blue underline cursor-pointer',
        },
      }),
      CharacterCount,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none min-h-[300px] p-6 focus:outline-none bg-white text-navy rounded-b-lg border-x border-b border-slate-200',
      },
    },
  })
  
  // Update editor content when the prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  return (
    <div className="w-full shadow-sm rounded-lg border border-slate-200">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <div className="bg-slate-50 border-t border-slate-100 px-4 py-2 flex justify-between items-center text-[10px] text-slate-400 font-medium">
        <div className="flex gap-3">
          <span>{editor?.storage.characterCount?.characters() || 0} characters</span>
          <span>{editor?.storage.characterCount?.words() || 0} words</span>
        </div>
        <div>Rich Text Mode</div>
      </div>
    </div>
  )
}
