import React, { useEffect, useState, useCallback } from 'react';
import {
  Container, Typography, Box, CircularProgress, Alert,
  Slider, Button, Divider, Paper
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import NotificationCard from '../components/NotificationCard';
import config from '../config';

const VIEWED_KEY = 'viewed_notification_ids';

function PriorityInboxPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [topN, setTopN] = useState(10);
  const [viewedIds, setViewedIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(VIEWED_KEY) || '[]'));
    } catch { return new Set(); }
  });

  const fetchPriority = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${config.API_BASE_URL}/priority-notifications?n=${topN}`);
      const data = res.data.priority_notifications || [];
      setNotifications(data);

      setTimeout(() => {
        const allIds = data.map(n => n.ID);
        const updated = new Set([...viewedIds, ...allIds]);
        setViewedIds(updated);
        localStorage.setItem(VIEWED_KEY, JSON.stringify([...updated]));
      }, 2000);
    } catch (err) {
      setError('Failed to load priority notifications. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [topN]); // eslint-disable-line

  useEffect(() => {
    fetchPriority();
  }, [fetchPriority]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <StarIcon color="warning" />
          <Typography variant="h5" fontWeight={700} color="primary">
            Priority Inbox
          </Typography>
        </Box>
        <Button
          startIcon={<RefreshIcon />}
          variant="outlined"
          onClick={fetchPriority}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }} elevation={1}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Show top <strong>{topN}</strong> notifications
        </Typography>
        <Slider
          value={topN}
          min={5}
          max={30}
          step={5}
          marks={[
            { value: 5, label: '5' },
            { value: 10, label: '10' },
            { value: 15, label: '15' },
            { value: 20, label: '20' },
            { value: 25, label: '25' },
            { value: 30, label: '30' },
          ]}
          onChange={(_, val) => setTopN(val)}
          valueLabelDisplay="auto"
          sx={{ color: '#1a237e' }}
        />
        <Typography variant="caption" color="text.disabled">
          Priority order: Placement &gt; Result &gt; Event, then by recency
        </Typography>
      </Paper>

      <Divider sx={{ mb: 2 }} />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress />
        </Box>
      ) : notifications.length === 0 ? (
        <Alert severity="info">No priority notifications found.</Alert>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Showing {notifications.length} priority notification(s)
          </Typography>
          {notifications.map((n, i) => (
            <Box key={n.ID} display="flex" alignItems="flex-start" gap={1}>
              <Typography
                variant="body2"
                sx={{
                  mt: 1.5, minWidth: 24, fontWeight: 700,
                  color: i < 3 ? '#f57c00' : '#757575'
                }}
              >
                #{i + 1}
              </Typography>
              <Box flex={1}>
                <NotificationCard
                  notification={n}
                  isNew={!viewedIds.has(n.ID)}
                />
              </Box>
            </Box>
          ))}
        </>
      )}
    </Container>
  );
}

export default PriorityInboxPage;
