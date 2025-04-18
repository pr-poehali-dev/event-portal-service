import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import { EventFilters as FiltersType, City, EventCategory } from '@/types/events';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface EventFiltersProps {
  onFilterChange: (filters: FiltersType) => void;
}

const EventFilters: React.FC<EventFiltersProps> = ({ onFilterChange }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [category, setCategory] = useState<EventCategory | undefined>(undefined);
  const [city, setCity] = useState<City | undefined>(undefined);
  
  const handleApplyFilters = () => {
    const filters: FiltersType = {};
    
    if (startDate) {
      filters.startDate = startDate.toISOString();
    }
    
    if (endDate) {
      filters.endDate = endDate.toISOString();
    }
    
    if (category) {
      filters.category = category;
    }
    
    if (city) {
      filters.city = city;
    }
    
    onFilterChange(filters);
  };
  
  const handleClearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setCategory(undefined);
    setCity(undefined);
    onFilterChange({});
  };
  
  return (
    <div className="bg-background p-4 rounded-lg shadow-sm border mb-6">
      <h3 className="text-lg font-medium mb-4">Фильтры мероприятий</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Начало периода</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                <Calendar className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'PPP', { locale: ru }) : 'Выберите дату'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                locale={ru}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Конец периода</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                <Calendar className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'PPP', { locale: ru }) : 'Выберите дату'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                locale={ru}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Категория</label>
          <Select value={category} onValueChange={(value) => setCategory(value as EventCategory)}>
            <SelectTrigger>
              <SelectValue placeholder="Все категории" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="concert">Концерт</SelectItem>
              <SelectItem value="theater">Театр</SelectItem>
              <SelectItem value="exhibition">Выставка</SelectItem>
              <SelectItem value="sport">Спорт</SelectItem>
              <SelectItem value="other">Другое</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Город</label>
          <Select value={city} onValueChange={(value) => setCity(value as City)}>
            <SelectTrigger>
              <SelectValue placeholder="Все города" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Копейск">Копейск</SelectItem>
              <SelectItem value="Челябинск">Челябинск</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handleClearFilters}>Сбросить</Button>
        <Button onClick={handleApplyFilters}>Применить</Button>
      </div>
    </div>
  );
};

export default EventFilters;
