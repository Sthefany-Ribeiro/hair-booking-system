interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: 'gold' | 'outline' | 'ghost'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'gold',
  disabled = false,
  loading = false,
  fullWidth = false,
}: ButtonProps) {
  const base = `
    inline-flex items-center justify-center gap-2
    font-sans text-sm font-medium tracking-wide
    transition-all duration-200
    disabled:opacity-40 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `

  const variants = {
    gold:    'bg-[#C49040] text-[#0B0806] hover:bg-[#DBA94A] px-7 py-3.5',
    outline: 'border border-[#EBE0CE]/25 text-[#EBE0CE] hover:border-[#EBE0CE] px-7 py-3.5',
    ghost:   'text-[#8A7560] hover:text-[#EBE0CE] px-4 py-2',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]}`}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  )
}