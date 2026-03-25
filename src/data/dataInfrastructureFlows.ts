export type DataInfrastructureFlow = {
  id: string
  title: string
  steps: string[]
}

/** Simple linear flows for the Data Infrastructure page — source → insight. */
export const DATA_INFRASTRUCTURE_FLOWS: DataInfrastructureFlow[] = [
  {
    id: 'core-athlete',
    title: 'Core Athlete Data',
    steps: [
      'Signup / Club Registration',
      'Swimmer Profile',
      'Pathway Tracking',
      'Federation Insights',
    ],
  },
  {
    id: 'performance',
    title: 'Performance Data',
    steps: [
      'Competitions / Timing Systems',
      'Results + PBs',
      'Performance Trends',
      'HP / Talent Signals',
    ],
  },
  {
    id: 'engagement-risk',
    title: 'Engagement & Risk',
    steps: [
      'Attendance + App Usage',
      'Engagement Signals',
      'Dropout Detection',
      'Retention Insights',
    ],
  },
  {
    id: 'commercial',
    title: 'Commercial Layer',
    steps: [
      'Participation + Pathway + Engagement',
      'Audience Segmentation',
      'Sponsor / Revenue Opportunities',
    ],
  },
  {
    id: 'geography',
    title: 'Geography Layer',
    steps: [
      'Registration locality & catchment',
      'Statistical area & regional mapping',
      'Participation density & access signals',
      'Program placement & investment view',
    ],
  },
]
