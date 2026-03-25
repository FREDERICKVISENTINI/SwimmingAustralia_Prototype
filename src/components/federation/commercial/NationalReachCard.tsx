const stateRows = [
  { name: 'New South Wales', value: '110k', share: '22%' },
  { name: 'Queensland', value: '99k', share: '20%' },
  { name: 'Victoria', value: '72k', share: '13%' },
  { name: 'Western Australia', value: '49k', share: '10%' },
  { name: 'South Australia', value: '38k', share: '10%' },
  { name: 'Tasmania', value: '7k', share: '2%' },
]

/** Stylised SVG Australia — prototype illustration, not GIS. */
export function NationalReachCard() {
  return (
    <section className="rounded-[var(--radius-card)] border border-border/80 bg-card p-5 shadow-[var(--shadow-card)] md:p-6">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-text-primary md:text-[1.75rem]">
          National reach
        </h2>
        <p className="mt-1 text-sm text-text-muted">Swimmer distribution by state</p>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_1fr]">
        <div className="rounded-[22px] bg-bg-elevated/60 p-4">
          <svg viewBox="0 0 520 360" className="h-auto w-full" aria-hidden>
            <defs>
              <linearGradient id="commercialAuFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#EAF5FF" />
                <stop offset="100%" stopColor="#9CCFFF" />
              </linearGradient>
              <linearGradient id="commercialEastFill" x1="0" y1="0" x2="0.8" y2="1">
                <stop offset="0%" stopColor="#72B8F8" />
                <stop offset="100%" stopColor="#1F86E5" />
              </linearGradient>
              <filter id="commercialAuShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="10" floodOpacity="0.08" />
              </filter>
            </defs>

            <path
              d="M63 152
                 L92 98 L144 77 L210 70 L281 43
                 L355 62 L404 48 L451 88 L455 136
                 L475 173 L461 215 L426 257 L401 275
                 L347 288 L305 302 L255 313 L212 300
                 L173 309 L130 295 L86 258 L70 226
                 L48 193 Z"
              fill="url(#commercialAuFill)"
              stroke="#CFE3F6"
              strokeWidth="2"
              filter="url(#commercialAuShadow)"
            />

            <path
              d="M63 152 L92 98 L144 77 L210 70 L210 198 L173 309 L130 295 L86 258 L70 226 L48 193 Z"
              fill="#E8F3FD"
              stroke="#D8E8F8"
              strokeWidth="2"
            />

            <path
              d="M210 70 L281 43 L305 123 L210 124 Z"
              fill="#DCEEFF"
              stroke="#D1E5F8"
              strokeWidth="2"
            />

            <path
              d="M210 124 L305 123 L307 244 L212 243 Z"
              fill="#D4EAFF"
              stroke="#CBE1F6"
              strokeWidth="2"
            />

            <path
              d="M305 43 L355 62 L404 48 L451 88 L455 136 L432 150 L383 140 L334 146 L305 123 Z"
              fill="#B6DBFF"
              stroke="#A9D0F7"
              strokeWidth="2"
            />

            <path
              d="M334 146 L383 140 L432 150 L438 208 L388 223 L334 210 Z"
              fill="url(#commercialEastFill)"
              stroke="#8EC3F2"
              strokeWidth="2"
            />

            <path
              d="M307 244 L388 223 L401 275 L347 288 L305 302 L282 274 Z"
              fill="#8AC1F4"
              stroke="#7CB7EE"
              strokeWidth="2"
            />

            <ellipse
              cx="362"
              cy="330"
              rx="24"
              ry="13"
              fill="#B8DCFF"
              stroke="#A7CEF4"
              strokeWidth="2"
            />

            <circle cx="396" cy="207" r="16" fill="#68D5B8" opacity="0.18" />
            <circle cx="396" cy="207" r="9" fill="#68D5B8" opacity="0.35" />
            <circle cx="396" cy="207" r="4.5" fill="#3CC89E" />

            <text x="118" y="185" fontSize="16" fill="#5D7A99" fontWeight="600">
              WA
            </text>
            <text x="242" y="100" fontSize="16" fill="#5D7A99" fontWeight="600">
              NT
            </text>
            <text x="247" y="190" fontSize="16" fill="#5D7A99" fontWeight="600">
              SA
            </text>
            <text x="370" y="102" fontSize="16" fill="#3A6F9F" fontWeight="700">
              QLD
            </text>
            <text x="373" y="184" fontSize="16" fill="#ffffff" fontWeight="700">
              NSW
            </text>
            <text x="336" y="267" fontSize="16" fill="#2F6E9E" fontWeight="700">
              VIC
            </text>
            <text x="352" y="334" fontSize="12" fill="#5D7A99" fontWeight="600">
              TAS
            </text>
          </svg>
        </div>

        <div className="rounded-[22px] bg-bg-elevated/60 p-4">
          <div className="space-y-3">
            {stateRows.map((row, i) => (
              <div
                key={row.name}
                className="flex items-center justify-between rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-[var(--shadow-card)]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent">
                    {i + 1}
                  </div>
                  <span className="truncate text-sm font-medium text-text-secondary">{row.name}</span>
                </div>

                <div className="ml-2 flex shrink-0 items-center gap-3">
                  <span className="text-sm font-semibold tabular-nums text-text-primary">{row.value}</span>
                  <span className="text-sm text-text-muted">{row.share}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs leading-5 text-text-muted">
            Geographic spread shows where sponsor activation can be national, regional, or hyper-local.
          </p>
        </div>
      </div>
    </section>
  )
}
