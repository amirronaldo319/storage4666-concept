/**
 * Demo boundary. This concept never transmits, stores or logs inquiry data.
 * There is deliberately no submission code path: wiring a real backend would
 * be new work, not a flag flip.
 */
export const DEMO_MODE = true as const

export const AGENCY = { name: 'SitePilot', url: 'https://sitepilotdesign.ca/' } as const
