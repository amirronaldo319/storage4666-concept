import { useI18n } from '../i18n'

const SPOKES = [0, 72, 144, 216, 288]

/** Hand-drawn storage rack illustration. Deliberately not a photo of the real facility. */
export function HeroArt() {
  const { t } = useI18n()
  const tireXs = [96, 192, 288, 384]
  return (
    <svg className="hero-svg" viewBox="0 0 480 440" width="480" height="440" role="img" aria-label={t('a11y.illustration')}>
      <defs>
        <g id="tire">
          <circle r="38" fill="#2a2a28" stroke="#4b4a45" strokeWidth="1.5" />
          <circle r="33" fill="none" stroke="#3b3a36" strokeWidth="6" strokeDasharray="3 4" />
          <circle r="21" fill="#d9d2c4" />
          <circle r="21" fill="none" stroke="#a79f8f" strokeWidth="1.5" />
          {SPOKES.map((a) => (
            <path key={a} d="M0 -6 L0 -19" stroke="#8d8576" strokeWidth="5" strokeLinecap="round" transform={`rotate(${a})`} />
          ))}
          <circle r="5" fill="#8d8576" />
        </g>
        <g id="tag">
          <path d="M0 0h16v20l-8 6-8-6z" fill="#e8792f" />
          <circle cx="8" cy="5" r="2" fill="#1b1b1b" />
        </g>
      </defs>
      <rect width="480" height="440" rx="14" fill="#1b1b1b" />
      <rect x="0" y="404" width="480" height="36" fill="#262624" />
      {/* uprights */}
      <rect x="28" y="28" width="10" height="376" fill="#6b675f" />
      <rect x="442" y="28" width="10" height="376" fill="#6b675f" />
      {/* shelves */}
      {[130, 262, 394].map((y) => (
        <rect key={y} x="28" y={y} width="424" height="9" fill="#8a857a" />
      ))}
      {/* row 1 and 2: tires seen from the front */}
      {[130, 262].map((y, row) =>
        tireXs.map((x, i) => (
          <g key={`${y}-${x}`}>
            <g transform={`translate(${x} ${y - 39})`}>
              <g className="art-drop" style={{ ['--i' as string]: row * 4 + i }}>
                <g className="art-spin">
                  <use href="#tire" />
                </g>
              </g>
            </g>
            {((row === 0 && i % 2 === 0) || (row === 1 && i === 1)) && (
              <g transform={`translate(${x + 22} ${y - 82})`}>
                <g className="art-tag" style={{ ['--i' as string]: i }}>
                  <use href="#tag" />
                </g>
              </g>
            )}
          </g>
        )),
      )}
      {/* row 3: stacked sets seen from the side */}
      {[70, 190, 310].map((x) => (
        <g key={x}>
          {[0, 1, 2].map((n) => (
            <rect key={n} x={x} y={394 - 26 - n * 24} width="100" height="24" rx="12" fill="#2a2a28" stroke="#4b4a45" strokeWidth="1.5" />
          ))}
          <g transform={`translate(${x + 42} ${394 - 100})`}>
            <g className="art-tag" style={{ ['--i' as string]: x / 60 }}>
              <use href="#tag" />
            </g>
          </g>
        </g>
      ))}
      <path className="art-dash" d="M346 394h60" stroke="#e8792f" strokeWidth="3" strokeDasharray="2 6" strokeLinecap="round" />
    </svg>
  )
}
