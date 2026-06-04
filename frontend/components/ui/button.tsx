import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'brand' | 'gold'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  asChild?: boolean
}

const sizeStyles = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  icon: 'h-10 w-10',
}

const variantStyles = {
  default: 'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-700 focus:ring-slate-300',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 focus:ring-slate-300',
  destructive: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-300',
  outline: 'border border-slate-300 text-slate-900 hover:bg-slate-50 active:bg-slate-100 focus:ring-[#1a6b53]/40',
  ghost: 'text-slate-900 hover:bg-slate-100 active:bg-slate-200 focus:ring-[#1a6b53]/30',
  brand: 'bg-[#1a6b53] text-white hover:bg-[#0f6f44] active:bg-[#0d4a3a] focus:ring-[#1a6b53]/40',
  gold: 'bg-[#D4AF37] text-slate-950 hover:bg-[#b99223] active:bg-[#987a1f] focus:ring-[#D4AF37]/40',
}

export function Button(props: ButtonProps & { children?: React.ReactNode }) {
  const { 
    className = '', 
    variant = 'default',
    size = 'md',
    asChild = false,
    children,
    ...buttonProps
  } = props
  
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50 disabled:cursor-not-allowed'
  const classes = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`
  
  if (asChild && children) {
    // When asChild is true, apply button styles as className to the wrapper
    return (
      <div className={classes}>
        {children}
      </div>
    )
  }

  return (
    <button 
      className={classes}
      {...(buttonProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  )
}
