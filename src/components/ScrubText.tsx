import { Fragment } from 'react'

/** Splits text into words so CSS scroll-driven animation can brighten them one by one. Plain text when unsupported. */
export function ScrubText({ text }: { text: string }) {
  const words = text.split(' ')
  return (
    <span className="scrub">
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="scrub-w" style={{ ['--k' as string]: i / words.length }}>{w}</span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </span>
  )
}
