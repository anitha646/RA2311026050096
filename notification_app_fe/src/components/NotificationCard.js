import React from 'react';
import { Card, CardContent, Typography, Chip } from '@mui/material';

const NotificationCard = ({ notification, isNew = false }) => {
  const getTypeColor = (type) => {
    switch(type) {
      case 'Placement': return 'success';
      case 'Result': return 'primary';
      case 'Event': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Card sx={{ mb: 2, position: 'relative' }}>
      {isNew && (
        <Chip 
          label="New" 
          color="error" 
          size="small" 
          sx={{ position: 'absolute', top: 10, right: 10 }}
        />
      )}
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {notification.Title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {notification.Message}
        </Typography>
        <Chip 
          label={notification.Type} 
          color={getTypeColor(notification.Type)} 
          size="small" 
          sx={{ mt: 1 }}
        />
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          {new Date(notification.Timestamp).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
