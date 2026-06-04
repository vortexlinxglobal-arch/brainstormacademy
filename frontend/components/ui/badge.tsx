import React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'brand' | 'gold'
}

export function Badge({ className = '', variant = 'default', ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors'
  
  const variantStyles = {
    default: 'bg-slate-900 text-slate-50 hover:bg-slate-800',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-slate-200 text-slate-900 hover:bg-slate-50',
    brand: 'bg-[#1a6b53] text-white hover:bg-[#0e7c4b]',
    gold: 'bg-[#D4AF37] text-slate-950 hover:bg-[#b99223]',
  }

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props} />
  )
}
