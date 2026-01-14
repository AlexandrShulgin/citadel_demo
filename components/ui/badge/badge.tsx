import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import styles from './badge.module.css'

export interface BadgeProps extends React.ComponentProps<'span'> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  asChild?: boolean
}

function Badge({
  className,
  variant = 'default',
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={`${styles.badge} ${styles[variant]} ${className || ''}`}
      {...props}
    />
  )
}

export { Badge }
export const badgeVariants = (props: { variant?: 'default' | 'secondary' | 'destructive' | 'outline' }) => {
  const variant = props.variant || 'default'
  return `${styles.badge} ${styles[variant]}`
}
