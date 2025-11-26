import { cva, type VariantProps } from 'class-variance-authority'

export { default as Button } from './button.vue'

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-all',
    'disabled:pointer-events-none disabled:opacity-50',
    'outline-none focus-visible:border-branding  focus-visible:ring-branding/50 focus-visible:ring-[3px] aria-invalid:ring-danger/20 aria-invalid:border-danger',
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0",
  ],
  {
    variants: {
      color: {
        default: [
          '[--button-accent:var(--color-branding)] [--button-complementary:var(--color-light)] [--button-accent-lighter:var(--color-branding-lighter)]',
          '[--button-outline:var(--color-branding)]',
        ],
        'background-highlighted': [
          '[--button-accent:var(--color-background-highlighted)] [--button-complementary:var(--color-text)] [--button-accent-lighter:var(--color-background-highlighted)]/70',
          '[--button-outline:var(--color-text)]',
        ],
        'background-blue': [
          '[--button-accent:var(--color-background-blue)] [--button-complementary:var(--color-branding)] [--button-accent-lighter:var(--color-background-blue)]/70',
          '[--button-outline:var(--color-branding)]',
        ],
        danger: [
          '[--button-accent:var(--color-danger)] [--button-complementary:var(--color-light)] [--button-accent-lighter:var(--color-danger-lighter)]',
          '[--button-outline:var(--color-danger)]',
        ],
        warning: [
          '[--button-accent:var(--color-warning)] [--button-complementary:var(--color-light)] [--button-accent-lighter:var(--color-warning-lighter)]',
          '[--button-outline:var(--color-warning)]',
        ],
        success: [
          '[--button-accent:var(--color-success)] [--button-complementary:var(--color-light)] [--button-accent-lighter:var(--color-success-lighter)]',
          '[--button-outline:var(--color-success)]',
        ],
      },
      variant: {
        default:
          'bg-(--button-accent) text-(--button-complementary) hover:bg-(--button-accent-lighter)',
        outline:
          'border-2 border-(--button-accent) text-(--button-outline) hover:text-(--button-complementary) hover:bg-(--button-accent)',
        ghost: 'hover:bg-background-highlighted hover:text-(--button-accent)',
      },
      size: {
        default: 'px-1 py-1 h-7',
        sm: "h-5 py-0.5 px-1 gap-1 text-xs [&_svg:not([class*='size-'])]:size-3",
        lg: 'px-5 py-1 h-8 gap-2.5 rounded-md',
        icon: "size-7 [&_svg:not([class*='size-'])]:size-6",
        'icon-sm': "size-5 [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      color: 'default',
      variant: 'default',
      size: 'default',
    },
  },
)
export type ButtonVariants = VariantProps<typeof buttonVariants>
