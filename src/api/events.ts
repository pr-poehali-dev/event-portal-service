import { EventFilters, EventItem, EventResponse } from '@/types/events';

const API_URL = 'https://your-api-url.com/api';

// Получить список всех мероприятий с возможной фильтрацией
export const getEvents = async (filters?: EventFilters): Promise<EventResponse> => {
  let url = `${API_URL}/events`;
  
  if (filters) {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.category) params.append('category', filters.category);
    if (filters.city) params.append('city', filters.city);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
  }
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Не удалось загрузить мероприятия');
  }
  
  return response.json();
};

// Получить одно мероприятие по ID
export const getEventById = async (id: string): Promise<EventItem> => {
  const response = await fetch(`${API_URL}/events/${id}`);
  if (!response.ok) {
    throw new Error('Не удалось загрузить мероприятие');
  }
  
  return response.json();
};

// Создать новое мероприятие (доступно только администратору)
export const createEvent = async (eventData: Omit<EventItem, 'id' | 'likes' | 'attendees' | 'created_by' | 'created_at'>, token: string): Promise<EventItem> => {
  const response = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(eventData)
  });
  
  if (!response.ok) {
    throw new Error('Не удалось создать мероприятие');
  }
  
  return response.json();
};

// Изменить статус посещения мероприятия
export const updateAttendanceStatus = async (eventId: string, attending: boolean, token: string): Promise<{ success: boolean }> => {
  const response = await fetch(`${API_URL}/events/${eventId}/attendance`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ attending })
  });
  
  if (!response.ok) {
    throw new Error('Не удалось обновить статус посещения');
  }
  
  return response.json();
};

// Поставить/убрать лайк мероприятию
export const toggleLike = async (eventId: string, token: string): Promise<{ success: boolean, likes: number }> => {
  const response = await fetch(`${API_URL}/events/${eventId}/like`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Не удалось обновить статус лайка');
  }
  
  return response.json();
};
