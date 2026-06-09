export const APP_NAME = 'rs-sports';

export const SPORT_TYPES = ['RUNNING', 'CYCLING', 'TREKKING'] as const;
export type SportType = (typeof SPORT_TYPES)[number];

export const SPORT_LABELS: Record<SportType, string> = {
  RUNNING: 'Running',
  CYCLING: 'Ciclismo',
  TREKKING: 'Trekking',
};

export const RANKING_PERIODS = ['all-time', 'monthly', 'weekly'] as const;
export type RankingPeriod = (typeof RANKING_PERIODS)[number];

export const ACTIVITY_STATUS = ['DRAFT', 'PUBLISHED'] as const;
export type ActivityStatus = (typeof ACTIVITY_STATUS)[number];

export const EVENT_STATUS = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'] as const;
export type EventStatus = (typeof EVENT_STATUS)[number];

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 20,
  maxLimit: 100,
} as const;
