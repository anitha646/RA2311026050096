import React from 'react';
import {
  Card, CardContent, Typography, Chip, Box
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AssessmentIcon from '@mui/icons-material/Assessment';
import WorkIcon from '@mui/icons-material/Work';

const typeConfig = {
  Placement: { color: 'success', icon: <WorkIcon fontSize="small" /> },
  Result: { color: 'warning', icon: <AssessmentIcon fontSize="small" /> },
  Event: { color: 'info', icon: <EventIcon fontSize="small" /> },
};

function NotificationCard({ notification, isNew }) {
  const { Type, Message, Timestamp } = notification;
  const config = typeConfig[Type] || { color: 'default', icon: null };
  const formattedTime = new Date(Timestamp).toLocaleString();

  return (
    <Card
      sx={{
        mb: 1.5,
        border: isNew ? '2px solid #1a237e' : '1px solid #e0e0e0',
        backgroundColor: isNew ? '#e8eaf6' : '#ffffff',
        borderRadius: 2,
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 4 },
      }}
    >
      <CardContent sx={{ pb: '12px !important' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              icon={config.icon}
              label={Type}
              color={config.color}
              size="small"
              variant="filled"
            />
            {isNew && (
              <Chip label="NEW" size="small" color="primary" variant="outlined" />
            )}
          </Box>
          <Typography variant="caption" color="text.secondary">
            {formattedTime}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ mt: 0.5, textTransform: 'capitalize' }}>
          {Message}
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
          ID: {notification.ID}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default NotificationCard;
