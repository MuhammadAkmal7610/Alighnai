import Link from 'next/link'
import { MoveLeft, AlertTriangle } from 'lucide-react'
import { CMS_PAGE_SHELL } from '@/lib/cms-page-shell'

export default function CMSNotFound() {
  return (
    <div className={`${CMS_PAGE_SHELL} flex min-h-[55vh] flex-col items-center justify-center sm:min-h-[70vh]`}>
      <div className="bg-white border border-slate-200 p-12 rounded-2xl shadow-sm text-center max-w-md w-full">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
          <AlertTriangle className="w-10 h-10 text-yellow-500" />
        </div>
        <h1 className="text-5xl font-extrabold text-navy mb-2">404</h1>
        <h2 className="text-xl font-bold text-navy mb-4">Resource Not Found</h2>
        <p className="text-slate-500 mb-8 font-medium">
          The management module or object you are looking for has been moved or does not exist.
        </p>
        <Link 
          href="/admin" 
          className="inline-flex items-center gap-2 bg-navy text-white px-8 py-3 rounded-lg font-bold hover:bg-navy/90 transition-all shadow-md active:scale-95"
        >
          <MoveLeft className="w-4 h-4" />
          Dashboard
        </Link>
      </div>
    </div>
  )
}
