import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import styles from './button.module.css'

export interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'
  asChild?: boolean
}

const sizeMap = {
  default: styles.sizeDefault,
  sm: styles.sizeSm,
  lg: styles.sizeLg,
  icon: styles.sizeIcon,
  'icon-sm': styles.sizeIconSm,
  'icon-lg': styles.sizeIconLg,
}

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={`${styles.button} ${styles[variant]} ${sizeMap[size]} ${className || ''}`}
      {...props}
    />
  )
}

export { Button }
export const buttonVariants = (props: { variant?: ButtonProps['variant'], size?: ButtonProps['size'] }) => {
  const variant = props.variant || 'default'
  const size = props.size || 'default'
  return `${styles.button} ${styles[variant]} ${sizeMap[size]}`
}
