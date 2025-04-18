export type EventCategory = 'concert' | 'theater' | 'exhibition' | 'sport' | 'other';

export type City = 'Копейск' | 'Челябинск';

export interface EventItem {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  category: EventCategory;
  city: City;
  likes: number;
  attendees: string[]; // массив id пользователей, которые отметили "пойду"
  created_by: string; // id администратора
  created_at: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

export interface EventResponse {
  events: EventItem[];
  total: number;
}

export interface EventFilters {
  startDate?: string;
  endDate?: string;
  category?: EventCategory;
  city?: City;
}
