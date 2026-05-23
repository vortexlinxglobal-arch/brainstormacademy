'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  imageSrc?: string
  name?: string
  size?: 'sm' | 'md' | 'lg'
}

const avatarSizes = {
  sm: 'h-10 w-10 text-sm',
  md: 'h-12 w-12 text-base',
  lg: 'h-14 w-14 text-lg',
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, imageSrc, name, size = 'md', ...props }, ref) => {
    const initials = name
      ? name
          .split(' ')
          .map((part) => part[0])
          .slice(0, 2)
          .join('')
          .toUpperCase()
      : 'BA'

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100',
          avatarSizes[size],
          className
        )}
        {...props}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={name ?? 'Avatar'}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-semibold uppercase tracking-wide">
            {initials}
          </span>
        )}
      </div>
    )
  }
)
Avatar.displayName = 'Avatar'

export { Avatar }
