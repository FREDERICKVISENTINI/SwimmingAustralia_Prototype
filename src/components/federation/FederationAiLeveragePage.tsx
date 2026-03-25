import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Brain,
  MessageSquareText,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react'

const useCases = [
  {
    icon: AlertTriangle,
    title: 'Predictive drop-out risk',
    description:
      'Identify swimmers at risk of disengaging or leaving the pathway based on attendance, progression, participation, and activity patterns — so federations can intervene before silent dropout.',
  },
  {
    icon: Sparkles,
    title: 'Talent identification',
    description:
      'Surface high-potential swimmers by combining performance trajectory, progression velocity, and coaching / HP indicators into a single, explainable view for selectors and pathway staff.',
  },
  {
    icon: BarChart3,
    title: 'Performance analysis',
    description:
      'Analyse swimmer performance against benchmarks, detect anomalies, and highlight development opportunities across events, age bands, and meet levels.',
  },
] as const

const conversationExamples = [
  {
    q: 'Which swimmers are at highest risk of dropping out in the next 90 days?',
    a: 'Demo insight: 142 swimmers flagged nationally; top risk band is 12–14 in metro clubs with declining meet attendance. Prioritise outreach to 23 clubs above threshold.',
  },
  {
    q: 'Which swimmers have shown the fastest progression in 2024?',
    a: 'Demo insight: Top cohort skews to 200m free and 400m IM; 18 athletes exceed +8% improvement vs cohort. Export list available for HP review.',
  },
  {
    q: 'Which clubs are underperforming in retention vs state average?',
    a: 'Demo insight: 11 clubs sit more than one standard deviation below state retention; regional support pack and club check-in workflow suggested.',
  },
] as const

export function FederationAiLeveragePage() {
  return (
    <div className="space-y-14 md:space-y-20">
      {/* Hero — intelligence banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-[#e8f4fc] via-white to-[#eef6ff] shadow-[0_8px_40px_-12px_rgb(15_28_48/0.12)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, rgb(0 153 204 / 0.12), transparent 45%),
              radial-gradient(circle at 80% 60%, rgb(53 199 243 / 0.1), transparent 40%),
              linear-gradient(135deg, transparent 40%, rgb(255 255 255 / 0.9) 100%)`,
          }}
        />
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/4 h-48 w-48 rounded-full bg-sky-200/40 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(rgb(15 28 48 / 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgb(15 28 48 / 0.08) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative grid gap-10 p-8 md:grid-cols-[1.1fr_0.9fr] md:p-10 lg:p-12">
          <div className="flex flex-col justify-center space-y-5">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/25 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent shadow-sm backdrop-blur-sm">
              <Zap className="h-3.5 w-3.5" aria-hidden />
              Proactive intelligence
            </div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-text-primary md:text-3xl lg:text-[2rem]">
              From passive reporting to{' '}
              <span className="text-accent">live strategic intelligence</span>
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-text-secondary md:text-[1.05rem]">
              AI sits as an intelligence layer across registrations, pathway stages, meets, and club operations — helping
              Swimming Australia move earlier, with clearer priorities and fewer blind spots.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <span className="rounded-[var(--radius-button)] bg-white/90 px-3 py-1.5 text-xs font-medium text-text-secondary shadow-sm ring-1 ring-border/60">
                Retention · Talent · Performance
              </span>
              <span className="rounded-[var(--radius-button)] bg-white/90 px-3 py-1.5 text-xs font-medium text-text-secondary shadow-sm ring-1 ring-border/60">
                Pathway · Operations · Commercial
              </span>
            </div>
          </div>

          <div className="relative flex min-h-[200px] items-center justify-center md:min-h-[240px]">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-accent/20 via-transparent to-sky-200/30 blur-sm" />
              <div className="relative space-y-3 rounded-2xl border border-white/80 bg-white/90 p-5 shadow-[var(--shadow-card)] backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15">
                      <Brain className="h-5 w-5 text-accent" aria-hidden />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">System signal</p>
                      <p className="text-sm font-semibold text-text-primary">National intelligence layer</p>
                    </div>
                  </div>
                  <TrendingUp className="h-5 w-5 text-success" aria-hidden />
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between rounded-lg bg-bg/80 px-3 py-2 text-sm">
                    <span className="text-text-muted">Drop-out risk (watchlist)</span>
                    <span className="font-semibold tabular-nums text-accent">↓ 12% vs last season</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-bg/80 px-3 py-2 text-sm">
                    <span className="text-text-muted">Talent velocity (cohort)</span>
                    <span className="font-semibold tabular-nums text-text-primary">Top quartile</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-bg/80 px-3 py-2 text-sm">
                    <span className="text-text-muted">Commercial cohort reach</span>
                    <span className="font-semibold tabular-nums text-text-primary">+8.4% addressable</span>
                  </div>
                </div>
                <p className="text-center text-[0.7rem] text-text-muted">Illustrative metrics — prototype demo only</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Narrative strip */}
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.12em] text-accent">Strategic shift</p>
        <p className="mt-3 text-lg leading-relaxed text-text-primary md:text-xl">
          Move from <span className="font-semibold">reactive dashboards</span> to{' '}
          <span className="font-semibold text-accent">anticipatory decisions</span> — with AI supporting retention, talent,
          performance insight, pathway planning, operations, and commercial opportunity.
        </p>
      </div>

      {/* Primary use-case cards */}
      <div>
        <div className="mb-8 md:mb-10">
          <h2 className="font-display text-xl font-semibold tracking-tight text-text-primary md:text-2xl">
            Primary AI use cases
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-text-secondary md:text-base">
            Three areas where an intelligence layer could strengthen the national system — practical today as simulated
            insight, with room to deepen as data and governance mature.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {useCases.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group flex flex-col rounded-[var(--radius-card)] border border-border/80 bg-card p-7 shadow-[var(--shadow-card)] transition duration-300 hover:border-accent/35 hover:shadow-[0_12px_40px_-16px_rgb(15_28_48/0.15)]"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/15 to-sky-100/80 text-accent ring-1 ring-accent/20 transition group-hover:from-accent/20">
                <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
              </div>
              <h3 className="font-display text-lg font-semibold tracking-tight text-text-primary">{title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary md:text-[0.95rem]">{description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Conversational insights */}
      <div className="rounded-2xl border border-border/80 bg-gradient-to-b from-white to-[#f5f9fc] p-8 shadow-[var(--shadow-card)] md:p-10 lg:p-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 lg:items-start">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 text-accent">
              <MessageSquareText className="h-5 w-5" aria-hidden />
              <span className="text-xs font-semibold uppercase tracking-[0.14em]">Natural language</span>
            </div>
            <h2 className="font-display text-xl font-semibold tracking-tight text-text-primary md:text-2xl">
              Conversational insights
            </h2>
            <p className="text-sm leading-relaxed text-text-secondary md:text-base">
              Federation staff could ask questions in plain language — across retention, talent, clubs, and meets — and
              receive grounded answers with charts, cohorts, and next-step suggestions. No query language required.
            </p>
            <p className="text-sm text-text-muted">
              Below is a stylised example of how a question might appear; responses would draw on unified national data
              under appropriate governance (demo only).
            </p>
            <div className="rounded-[var(--radius-card)] border border-border/80 bg-bg-elevated/80 p-4 shadow-inner">
              <label className="sr-only" htmlFor="ai-leverage-example-query">
                Example question
              </label>
              <div className="flex items-start gap-3 rounded-[var(--radius-button)] border border-border bg-card px-4 py-3 shadow-sm">
                <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                <p id="ai-leverage-example-query" className="text-sm leading-snug text-text-primary">
                  What’s the drop-out rate in the elite age group compared to last season?
                </p>
              </div>
              <button
                type="button"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
              >
                Run insight (demo)
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>

          <div className="rounded-[var(--radius-card)] border border-border/70 bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="mb-4 flex items-center gap-2 border-b border-border/60 pb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/12">
                <Sparkles className="h-4 w-4 text-accent" aria-hidden />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Assistant preview</p>
                <p className="text-sm font-semibold text-text-primary">Federation Q&amp;A (sample)</p>
              </div>
            </div>
            <ul className="space-y-4">
              {conversationExamples.map(({ q, a }) => (
                <li key={q} className="rounded-xl border border-border/50 bg-bg/60 p-4">
                  <p className="text-xs font-medium text-accent">Q</p>
                  <p className="mt-1 text-sm font-medium text-text-primary">{q}</p>
                  <p className="mt-2 border-t border-border/40 pt-2 text-xs font-medium text-text-muted">Insight (demo)</p>
                  <p className="mt-1 text-sm leading-relaxed text-text-secondary">{a}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Closing line */}
      <div className="rounded-[var(--radius-card)] border border-accent/25 bg-accent/5 px-6 py-8 text-center md:px-10">
        <p className="font-display text-lg font-semibold text-text-primary md:text-xl">
          This platform could become an <span className="text-accent">intelligence system</span> — not just a reporting
          system.
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-text-secondary">
          AI augments human judgement: surfacing risk, opportunity, and narrative — so Swimming Australia can act earlier
          and invest attention where it matters most.
        </p>
      </div>
    </div>
  )
}
