import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import EventCard from '@/components/EventCard';
import EventFilters from '@/components/EventFilters';
import { getEvents } from '@/api/events';
import { EventFilters as FiltersType, EventItem } from '@/types/events';
import { Button } from '@/components/ui/button';

const Homepage: React.FC = () => {
  const [filters, setFilters] = useState<FiltersType>({});
  
  const { 
    data,
    isLoading,
    isError,
    refetch 
  } = useQuery({
    queryKey: ['events', filters],
    queryFn: () => getEvents(filters),
  });

  const handleFilterChange = (newFilters: FiltersType) => {
    setFilters(newFilters);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4">Загрузка мероприятий...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <p className="text-destructive text-lg">Произошла ошибка при загрузке мероприятий</p>
          <Button onClick={() => refetch()} className="mt-4">Попробовать снова</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Мероприятия в Копейске и Челябинске</h1>
      
      <EventFilters onFilterChange={handleFilterChange} />
      
      {data?.events.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">Мероприятий не найдено</p>
          <p className="text-sm text-muted-foreground mt-2">Попробуйте изменить параметры поиска</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.events.map((event: EventItem) => (
            <EventCard 
              key={event.id} 
              event={event}
              onStatusUpdate={refetch}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Homepage;
