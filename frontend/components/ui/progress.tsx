import React from 'react'

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
}

export function Progress({ value = 0, max = 100, className = '', ...props }: ProgressProps) {
  const percentage = (value / max) * 100

  return (
    <div 
      className={`h-2 w-full overflow-hidden rounded-full bg-slate-200 ${className}`}
      {...props}
    >
      <div
        className="h-full bg-slate-900 transition-all"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
