"use client"

import { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import CharacterCount from '@tiptap/extension-character-count'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import TiptapImage from '@tiptap/extension-image'
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
  onDone?: () => void
  variant?: 'full' | 'compact' | 'ghost'
  placeholder?: string
  minHeight?: string
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

  const addImage = () => {
    const url = window.prompt('Image URL')
    if (url) {
      (editor.chain().focus() as any).setImage({ src: url }).run()
    }
  }

  const addTable = () => {
    (editor.chain().focus() as any).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-1.5 bg-white/80 backdrop-blur-md border-b border-slate-200 rounded-t-lg sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-0.5 border-r border-slate-200 pr-1.5 mr-1.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            "h-8 w-8 p-0 transition-all rounded-md",
            editor.isActive('bold') 
              ? 'bg-navy text-white hover:bg-navy/90' 
              : 'text-slate-600 hover:bg-slate-100'
          )}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            "h-8 w-8 p-0 transition-all rounded-md",
            editor.isActive('italic') 
              ? 'bg-navy text-white hover:bg-navy/90' 
              : 'text-slate-600 hover:bg-slate-100'
          )}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn(
            "h-8 w-8 p-0 transition-all rounded-md",
            editor.isActive('underline') 
              ? 'bg-navy text-white hover:bg-navy/90' 
              : 'text-slate-600 hover:bg-slate-100'
          )}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-0.5 border-r border-slate-200 pr-1.5 mr-1.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(
            "h-8 w-8 p-0 transition-all rounded-md",
            editor.isActive('heading', { level: 1 }) 
              ? 'bg-navy text-white hover:bg-navy/90' 
              : 'text-slate-600 hover:bg-slate-100'
          )}
          title="H1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            "h-8 w-8 p-0 transition-all rounded-md",
            editor.isActive('heading', { level: 2 }) 
              ? 'bg-navy text-white hover:bg-navy/90' 
              : 'text-slate-600 hover:bg-slate-100'
          )}
          title="H2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-0.5 border-r border-slate-200 pr-1.5 mr-1.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "h-8 w-8 p-0 transition-all rounded-md",
            editor.isActive('bulletList') 
              ? 'bg-navy text-white hover:bg-navy/90' 
              : 'text-slate-600 hover:bg-slate-100'
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
            "h-8 w-8 p-0 transition-all rounded-md",
            editor.isActive('orderedList') 
              ? 'bg-navy text-white hover:bg-navy/90' 
              : 'text-slate-600 hover:bg-slate-100'
          )}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-0.5 border-r border-slate-200 pr-1.5 mr-1.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addLink}
          className={cn(
            "h-8 w-8 p-0 transition-all rounded-md",
            editor.isActive('link') 
              ? 'bg-navy text-white hover:bg-navy/90' 
              : 'text-slate-600 hover:bg-slate-100'
          )}
          title="Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addImage}
          className="h-8 w-8 p-0 text-slate-600 hover:bg-slate-100 rounded-md"
          title="Image"
        >
          <Eraser className="h-4 w-4 rotate-180" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addTable}
          className="h-8 w-8 p-0 text-slate-600 hover:bg-slate-100 rounded-md"
          title="Table"
        >
          <Code className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-0.5 ml-auto">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          className="h-8 w-8 p-0 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-md"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          className="h-8 w-8 p-0 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-md"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

const GhostToolbar = ({ editor, onDone }: { editor: any, onDone: () => void }) => {
  if (!editor) return null
  return (
    <div className="flex flex-wrap items-center gap-0.5 p-1 bg-white border border-slate-200 rounded-lg shadow-sm mb-2 border-b">
      <div className="flex items-center gap-0.5 border-r border-slate-100 pr-1 mr-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn("h-7 w-7 p-0", editor.isActive('bold') ? 'bg-slate-100 text-navy' : 'text-slate-500')}
          title="Bold"
        >
          <Bold className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn("h-7 w-7 p-0", editor.isActive('italic') ? 'bg-slate-100 text-navy' : 'text-slate-500')}
          title="Italic"
        >
          <Italic className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn("h-7 w-7 p-0", editor.isActive('underline') ? 'bg-slate-100 text-navy' : 'text-slate-500')}
          title="Underline"
        >
          <UnderlineIcon className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="flex items-center gap-0.5 border-r border-slate-100 pr-1 mr-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            const url = window.prompt('URL')
            if (url) editor.chain().focus().setLink({ href: url }).run()
          }}
          className={cn("h-7 w-7 p-0", editor.isActive('link') ? 'bg-slate-100 text-navy' : 'text-slate-500')}
          title="Link"
        >
          <LinkIcon className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="flex items-center gap-0.5 border-r border-slate-100 pr-1 mr-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn("h-7 w-7 p-0", editor.isActive('bulletList') ? 'bg-slate-100 text-navy' : 'text-slate-500')}
          title="Bullets"
        >
          <List className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn("h-7 w-7 p-0", editor.isActive('orderedList') ? 'bg-slate-100 text-navy' : 'text-slate-500')}
          title="Numbers"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </Button>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onDone}
        className="ml-auto h-7 px-2 text-[10px] font-bold text-cyan-600 hover:text-cyan-700 bg-cyan-50 hover:bg-cyan-100 rounded"
      >
        DONE
      </Button>
    </div>
  )
}

export const CMSEditor: React.FC<CMSEditorProps> = ({ 
  content, 
  onChange, 
  onDone,
  variant = 'full', 
  placeholder = 'Start writing...',
  minHeight = '300px'
}) => {
  const [isFocused, setIsFocused] = useState(false)
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
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TiptapImage.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      CharacterCount,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => {
      // Small delay to allow clicking toolbar buttons
      setTimeout(() => setIsFocused(false), 200)
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-slate max-w-none focus:outline-none transition-all duration-200",
          variant === 'full' && "p-6 rounded-b-lg border-x border-b border-slate-200 bg-white text-navy",
          variant === 'compact' && "p-3 rounded-lg border border-slate-200 bg-white text-navy",
          variant === 'ghost' && "p-4 rounded-lg bg-white text-navy border border-slate-200 min-h-[3.5rem] shadow-xl"
        ),
        style: minHeight && variant !== 'ghost' ? `min-height: ${minHeight}` : '',
        placeholder,
      },
    },
  })
  
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  const handleDone = () => {
    setIsFocused(false)
    editor?.commands.blur()
    onDone?.()
  }

  return (
    <div className={cn(
      "w-full transition-all duration-300 relative z-[50]",
      variant === 'full' ? "shadow-sm rounded-lg border border-slate-200" : "",
      variant === 'ghost' ? "mt-2 mb-2" : "shadow-md rounded-xl"
    )}>
      {variant === 'full' && <MenuBar editor={editor} />}
      {variant === 'ghost' && isFocused && (
        <div className="ghost-toolbar">
          <GhostToolbar editor={editor} onDone={handleDone} />
        </div>
      )}
      
      <div className={cn(variant === 'ghost' ? "bg-white rounded-lg shadow-sm" : "")}>
        <EditorContent editor={editor} />
      </div>
      
      {variant === 'full' && (
        <div className="bg-slate-50 border-t border-slate-100 px-4 py-2 flex justify-between items-center text-[10px] text-slate-400 font-medium">
          <div className="flex gap-3">
            <span>{editor?.storage.characterCount?.characters() || 0} characters</span>
            <span>{editor?.storage.characterCount?.words() || 0} words</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-mid-blue">
            <div className="h-1 w-1 rounded-full bg-mid-blue" />
            PRO EDITOR
          </div>
        </div>
      )}
    </div>
  )
}
