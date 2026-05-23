import React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className = '', ...props }: CardProps) {
  return (
    <div 
      className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}
      {...props}
    />
  )
}

export function CardHeader({ className = '', ...props }: CardProps) {
  return (
    <div 
      className={`flex flex-col space-y-1.5 border-b border-slate-200 px-6 py-4 ${className}`}
      {...props}
    />
  )
}

export function CardContent({ className = '', ...props }: CardProps) {
  return (
    <div 
      className={`px-6 py-4 ${className}`}
      {...props}
    />
  )
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({ className = '', ...props }: CardTitleProps) {
  return (
    <h2 
      className={`text-lg font-semibold text-slate-900 ${className}`}
      {...props}
    />
  )
}

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function CardDescription({ className = '', ...props }: CardDescriptionProps) {
  return (
    <p 
      className={`text-sm text-slate-600 ${className}`}
      {...props}
    />
  )
}
