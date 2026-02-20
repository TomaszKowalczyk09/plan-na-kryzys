import clsx from 'clsx'

export function StoryScreen({ className, variant = 'light', children }) {
  return (
    <div className={clsx('storyScreen', `storyScreen--${variant}`, className)}>
      <div className="storyScreenInner">{children}</div>
    </div>
  )
}

export function StoryCard({ className, tone = 'surface', children }) {
  return (
    <section className={clsx('storyCard', `storyCard--${tone}`, className)}>
      {children}
    </section>
  )
}

export function CTAButton({ as: Comp = 'button', className, tone = 'primary', ...props }) {
  return <Comp className={clsx('ctaBtn', `ctaBtn--${tone}`, className)} {...props} />
}

export function CloudIcon({ mood = 'smile', className, label }) {
  const map = {
    smile: '☁️🙂',
    sad: '☁️😔',
    calm: '☁️😌',
    support: '☁️🤝',
    portal: '🟣☁️😔',
    duo: '☁️🙂  ☁️🤍',
  }
  return (
    <div className={clsx('cloudIcon', className)} role={label ? 'img' : undefined} aria-label={label}>
      {map[mood] ?? map.calm}
    </div>
  )
}
