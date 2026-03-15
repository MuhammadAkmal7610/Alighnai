import { notFound } from 'next/navigation'

export default function CMSNotFound() {
  return (
    <div className="p-6">
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h1 className="text-6xl font-bold text-cyan mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-2">CMS Page Not Found</h2>
        <p className="text-slate mb-8">The management page you are looking for does not exist.</p>
        <a href="/" className="bg-cyan text-navy px-6 py-3 rounded-btn font-semibold hover:bg-cyan/90 transition-colors">
          Back to Dashboard
        </a>
      </div>
    </div>
  )
}
