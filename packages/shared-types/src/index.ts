export type SportType = 'RUNNING' | 'CYCLING' | 'TREKKING';
export type ActivityStatus = 'DRAFT' | 'PUBLISHED';
export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
export type RankingPeriod = 'all-time' | 'monthly' | 'weekly';
export type GroupRole = 'admin' | 'member';

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sport {
  id: string;
  type: SportType;
  name: string;
  description?: string;
  icon?: string;
}

export interface Activity {
  id: string;
  userId: string;
  sportId: string;
  title: string;
  description?: string;
  distance?: number; // metros
  duration?: number; // segundos
  elevation?: number; // metros de desnivel
  date: Date;
  status: ActivityStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  userId: string;
  activityId?: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  postId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Like {
  id: string;
  userId: string;
  postId?: string;
  commentId?: string;
  createdAt: Date;
}

export interface Event {
  id: string;
  sportId: string;
  title: string;
  description?: string;
  location?: string;
  date: Date;
  maxParticipants?: number;
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventParticipant {
  id: string;
  userId: string;
  eventId: string;
  joinedAt: Date;
}

export interface Group {
  id: string;
  sportId?: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  role: GroupRole;
  joinedAt: Date;
}

export interface Ranking {
  id: string;
  userId: string;
  sportId: string;
  score: number;
  position?: number;
  period: RankingPeriod;
  updatedAt: Date;
}
