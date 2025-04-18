import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import CreateEventForm from '@/components/CreateEventForm';

const AdminCreateEventPage: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);
  
  const handleCreateSuccess = () => {
    navigate('/');
  };
  
  if (!isAuthenticated || !isAdmin) {
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Создание нового мероприятия</h1>
      <div className="max-w-2xl mx-auto">
        <CreateEventForm onSuccess={handleCreateSuccess} />
      </div>
    </div>
  );
};

export default AdminCreateEventPage;
