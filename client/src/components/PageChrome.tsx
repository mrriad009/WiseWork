import React from 'react'
import { Scale } from 'lucide-react'

/** Full-page atmospheric background — landing + app */
export function PageBackground() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-20 bg-ww-dots" aria-hidden />
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_90%_60%_at_50%_-15%,rgba(15,118,110,0.11),transparent_55%),radial-gradient(ellipse_50%_45%_at_100%_20%,rgba(120,113,108,0.05),transparent),radial-gradient(ellipse_45%_40%_at_0%_90%,rgba(15,118,110,0.04),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-[#ebe9e4]/40"
        aria-hidden
      />
    </>
  )
}

type BrandSize = 'sm' | 'md' | 'lg'

export function BrandMark({ size = 'md' }: { size?: BrandSize }) {
  const box = size === 'sm' ? 'h-8 w-8 rounded-lg' : size === 'lg' ? 'h-12 w-12 rounded-2xl' : 'h-10 w-10 rounded-xl'
  const icon = size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-6 w-6' : 'h-[18px] w-[18px]'
  return (
    <span className={`inline-flex ${box} items-center justify-center bg-stone-900 text-white shadow-md shadow-stone-900/15 ring-1 ring-black/5`}>
      <Scale className={icon} strokeWidth={2} aria-hidden />
    </span>
  )
}

export function BrandWordmark({ subtitle }: { subtitle?: boolean }) {
  return (
    <div className="leading-tight">
      <span className="block font-semibold tracking-tight text-stone-900">WiseWork</span>
      {subtitle && <span className="mt-0.5 block text-[11px] font-medium text-stone-500">CV ranking & judgment</span>}
    </div>
  )
}
