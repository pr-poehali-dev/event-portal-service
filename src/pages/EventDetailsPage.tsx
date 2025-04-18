import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getEventById, updateAttendanceStatus, toggleLike } from '@/api/events';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Heart, Calendar, Share2, CalendarCheck, CalendarX, ArrowLeft } from 'lucide-react';

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();
  
  const { data: event, isLoading, isError, refetch } = useQuery({
    queryKey: ['event', id],
    queryFn: () => id ? getEventById(id) : Promise.reject('No event ID provided'),
    enabled: !!id,
  });
  
  const isAttending = event && user ? event.attendees.includes(user.id) : false;
  
  const handleAttendanceToggle = async () => {
    if (!id || !isAuthenticated || !token) {
      toast({
        title: "Требуется авторизация",
        description: "Чтобы отметить посещение, необходимо войти в систему",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateAttendanceStatus(id, !isAttending, token);
      refetch();
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
    if (!id || !isAuthenticated || !token) {
      toast({
        title: "Требуется авторизация",
        description: "Чтобы поставить лайк, необходимо войти в систему",
        variant: "destructive"
      });
      return;
    }

    try {
      await toggleLike(id, token);
      refetch();
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
        title: event?.title,
        text: event?.description,
        url: window.location.href
      }).catch(() => {
        // Fallback if sharing failed
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Ссылка скопирована",
      description: "Теперь вы можете поделиться мероприятием",
    });
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4">Загрузка информации о мероприятии...</p>
        </div>
      </div>
    );
  }
  
  if (isError || !event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <p className="text-destructive text-lg">Мероприятие не найдено</p>
          <Button onClick={() => navigate('/')} className="mt-4">Вернуться на главную</Button>
        </div>
      </div>
    );
  }
  
  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, 'd MMMM yyyy, HH:mm', { locale: ru });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-6 flex items-center"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-8 rounded-lg overflow-hidden shadow-md">
            <img 
              src={event.image || "/placeholder.svg"} 
              alt={event.title} 
              className="w-full h-[300px] md:h-[400px] object-cover"
            />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>{formattedDate}</span>
            </div>
            <div className="px-3 py-1 bg-primary/10 text-primary rounded-full">
              {event.category === 'concert' && 'Концерт'}
              {event.category === 'theater' && 'Театр'}
              {event.category === 'exhibition' && 'Выставка'}
              {event.category === 'sport' && 'Спорт'}
              {event.category === 'other' && 'Другое'}
            </div>
            <div className="text-muted-foreground">{event.city}</div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p>{event.description}</p>
          </div>
        </div>
        
        <div>
          <Card className="p-6">
            <h3 className="text-xl font-medium mb-6">Действия</h3>
            
            <div className="space-y-4">
              <Button
                className="w-full flex items-center justify-center gap-2"
                onClick={handleAttendanceToggle}
                disabled={!isAuthenticated}
              >
                {isAttending ? <CalendarCheck className="h-5 w-5" /> : <CalendarX className="h-5 w-5" />}
                {isAttending ? 'Я пойду на мероприятие' : 'Отметить, что пойду'}
              </Button>
              
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleLikeToggle}
                disabled={!isAuthenticated}
              >
                <Heart className={`h-5 w-5 ${isAuthenticated ? 'fill-primary' : ''}`} />
                Нравится ({event.likes})
              </Button>
              
              <Button
                variant="secondary"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5" />
                Поделиться
              </Button>
            </div>
            
            {!isAuthenticated && (
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Чтобы взаимодействовать с мероприятием, необходимо
                <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/login')}>
                  войти
                </Button>
                {' '}или{' '}
                <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/register')}>
                  зарегистрироваться
                </Button>
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
