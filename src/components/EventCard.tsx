import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Share2, CalendarCheck, CalendarX } from 'lucide-react';
import { EventItem } from '@/types/events';
import { useAuth } from '@/contexts/AuthContext';
import { updateAttendanceStatus, toggleLike } from '@/api/events';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface EventCardProps {
  event: EventItem;
  onStatusUpdate: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onStatusUpdate }) => {
  const { user, token, isAuthenticated } = useAuth();
  
  const isAttending = user ? event.attendees.includes(user.id) : false;

  const handleAttendanceToggle = async () => {
    if (!isAuthenticated || !token) {
      toast({
        title: "Требуется авторизация",
        description: "Чтобы отметить посещение, необходимо войти в систему",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateAttendanceStatus(event.id, !isAttending, token);
      onStatusUpdate();
      toast({
        title: !isAttending ? "Вы собираетесь посетить мероприятие" : "Вы отменили посещение",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус посещения",
        variant: "destructive"
      });
    }
  };

  const handleLikeToggle = async () => {
    if (!isAuthenticated || !token) {
      toast({
        title: "Требуется авторизация",
        description: "Чтобы поставить лайк, необходимо войти в систему",
        variant: "destructive"
      });
      return;
    }

    try {
      await toggleLike(event.id, token);
      onStatusUpdate();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить лайк",
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.origin + `/events/${event.id}`
      }).catch(() => {
        // Fallback if sharing failed
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    const url = `${window.location.origin}/events/${event.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Ссылка скопирована",
      description: "Теперь вы можете поделиться мероприятием",
    });
  };

  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, 'd MMMM yyyy, HH:mm', { locale: ru });

  return (
    <Card className="w-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 overflow-hidden">
        <img 
          src={event.image || "/placeholder.svg"} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{event.title}</CardTitle>
            <CardDescription className="text-sm mt-1">
              {formattedDate}, {event.city}
            </CardDescription>
          </div>
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
            {event.category === 'concert' && 'Концерт'}
            {event.category === 'theater' && 'Театр'}
            {event.category === 'exhibition' && 'Выставка'}
            {event.category === 'sport' && 'Спорт'}
            {event.category === 'other' && 'Другое'}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm line-clamp-3">{event.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className={`flex items-center gap-1 ${isAuthenticated && isAttending ? 'bg-primary/10' : ''}`}
            onClick={handleAttendanceToggle}
          >
            {isAttending ? <CalendarCheck size={16} /> : <CalendarX size={16} />}
            {isAttending ? 'Пойду' : 'Не пойду'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleLikeToggle}
          >
            <Heart size={16} className={isAuthenticated ? 'fill-primary' : ''} />
            <span>{event.likes}</span>
          </Button>
        </div>
        
        <Button variant="ghost" size="sm" onClick={handleShare}>
          <Share2 size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
