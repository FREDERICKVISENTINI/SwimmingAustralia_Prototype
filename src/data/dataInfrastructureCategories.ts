/**
 * Federation Data Infrastructure — category taxonomy for the prototype.
 * Fields & sources are illustrative of unified national platform coverage.
 */

export type DataCategoryMetaKind = 'derived' | 'live' | 'system'

export type DataInfrastructureCategory = {
  id: string
  title: string
  /** Short labels for chip display — key data captured. */
  keyDataCaptured: string[]
  /** Human-readable source systems / feeds. */
  sources: string[]
  /** Optional row of processing / input modality hints. */
  meta?: DataCategoryMetaKind[]
}

export const DATA_INFRASTRUCTURE_CATEGORIES: DataInfrastructureCategory[] = [
  {
    id: 'identity-registration',
    title: 'Swimmer Identity & Registration',
    keyDataCaptured: [
      'Legal name · preferred name',
      'Date of birth · age band',
      'National member ID · club affiliation',
      'Gender · registration status',
      'Guardian linkage · contact channels',
      'Membership term · renewal dates',
      'Photo consent · media flags',
    ],
    sources: ['National registration service', 'Club admin portal', 'SSO / identity provider'],
    meta: ['live', 'system'],
  },
  {
    id: 'pathway-progression',
    title: 'Pathway & Progression',
    keyDataCaptured: [
      'Pathway stage · squad assignment',
      'Stage transitions · effective dates',
      'Readiness indicators · benchmarks',
      'Development plan tags',
      'Selection / trial outcomes',
      'Pathway velocity vs cohort',
    ],
    sources: ['Pathway engine', 'Club squad systems', 'State pathway programmes'],
    meta: ['live', 'derived'],
  },
  {
    id: 'competition-results',
    title: 'Competition & Results',
    keyDataCaptured: [
      'Meet entries · scratch / seed times',
      'Official results · splits · placings',
      'Qualification flags · PB markers',
      'Meet level · sanction ID',
      'Relay composition · team codes',
      'Ranking snapshots · age standards',
    ],
    sources: ['Meet results warehouse', 'Hy-Tek / Meet Manager imports', 'National timing feeds'],
    meta: ['system', 'live'],
  },
  {
    id: 'technique-hp',
    title: 'Technique & HP Signals',
    keyDataCaptured: [
      'SPARTA II · screening composites',
      'Coach HP flags · observation notes',
      'Assessment windows · retest cadence',
      'Video review tags · biomech scores',
      'Talent programme nominations',
    ],
    sources: ['HP screening service', 'Coach workspace', 'National camp systems'],
    meta: ['live', 'system'],
  },
  {
    id: 'attendance-engagement',
    title: 'Attendance & Engagement',
    keyDataCaptured: [
      'Session attendance · streaks',
      'Programme hours · term load',
      'App / portal sessions',
      'Notification engagement',
      'Event RSVP · check-in',
    ],
    sources: ['Club training systems', 'App analytics', 'Event platform'],
    meta: ['live', 'derived'],
  },
  {
    id: 'dropout',
    title: 'Dropout Indicators',
    keyDataCaptured: [
      'Attendance decline slope',
      'Payment lapse · arrears stage',
      'Squad churn · re-enrol gaps',
      'Engagement index vs cohort',
      'Intervention touchpoints',
    ],
    sources: ['Derived retention models', 'Payments ledger', 'Club operational feeds'],
    meta: ['derived', 'system'],
  },
  {
    id: 'coach-club',
    title: 'Coach & Club Data',
    keyDataCaptured: [
      'Coach credentials · accreditation',
      'Club profile · ABN / entity',
      'Roster caps · discipline mix',
      'Facility association',
      'Performance vs federation KPIs',
    ],
    sources: ['Club administration', 'Coach registry', 'Federation accreditation DB'],
    meta: ['live', 'system'],
  },
  {
    id: 'family-account',
    title: 'Family & Account Data',
    keyDataCaptured: [
      'Household grouping · payer role',
      'Multi-child links',
      'Communication preferences',
      'Payment methods · mandates',
      'Support tickets · case notes',
    ],
    sources: ['Account service', 'Payments gateway', 'CRM / service desk'],
    meta: ['live', 'system'],
  },
  {
    id: 'facility-geo',
    title: 'Geography & regional participation',
    keyDataCaptured: [
      'State / territory · club primary catchment',
      'Postcode · locality (aggregated for mapping)',
      'SA4 / statistical area · metro vs regional vs remote',
      'Participation density & growth by region',
      'Cross-border membership · state eligibility context',
    ],
    sources: ['ABS / boundary references', 'Geo enrichment service', 'National registration geography'],
    meta: ['system', 'derived'],
  },
  {
    id: 'competition-infra',
    title: 'Competition Infrastructure',
    keyDataCaptured: [
      'Sanction calendar · meet IDs',
      'Course type · LCM / SCM',
      'Qualification pathways per meet',
      'Official assignments',
      'Results publication status',
    ],
    sources: ['National events service', 'Meet host systems', 'Sanctioning workflow'],
    meta: ['live', 'system'],
  },
  {
    id: 'commercial-transaction',
    title: 'Commercial & Transaction',
    keyDataCaptured: [
      'Fees · invoices · settlements',
      'Sponsor packages · entitlements',
      'Premium product SKUs',
      'Partner activation codes',
      'Revenue allocation · state share',
    ],
    sources: ['Payments platform', 'Commercial CRM', 'Sponsor & partner workspace'],
    meta: ['live', 'system'],
  },
  {
    id: 'aggregated-derived',
    title: 'Aggregated & Derived Data',
    keyDataCaptured: [
      'National cohort indices',
      'Anonymised participation stats',
      'Benchmark percentiles',
      'Forecast layers · trend signals',
      'Partner-ready segment rollups',
    ],
    sources: ['Analytics warehouse', 'Federation insight jobs', 'Export APIs'],
    meta: ['derived', 'system'],
  },
]
