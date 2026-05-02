import React, { useEffect, useState, useCallback } from 'react';
import {
  Container, Typography, Box, CircularProgress, Alert,
  FormControl, InputLabel, Select, MenuItem, Button, Divider
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import NotificationCard from '../components/NotificationCard';
import config from '../config';

const VIEWED_KEY = 'viewed_notification_ids';

function AllNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [typeFilter, setTypeFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewedIds, setViewedIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(VIEWED_KEY) || '[]'));
    } catch { return new Set(); }
  });

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${config.API_BASE_URL}/notifications`);
      const data = res.data.notifications || [];
      setNotifications(data);

      // Mark all currently visible as viewed after a short delay
      setTimeout(() => {
        const allIds = data.map(n => n.ID);
        const updated = new Set([...viewedIds, ...allIds]);
        setViewedIds(updated);
        localStorage.setItem(VIEWED_KEY, JSON.stringify([...updated]));
      }, 2000);
    } catch (err) {
      setError('Failed to load notifications. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (typeFilter === 'All') {
      setFiltered(notifications);
    } else {
      setFiltered(notifications.filter(n => n.Type === typeFilter));
    }
  }, [notifications, typeFilter]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={700} color="primary">
          All Notifications
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          variant="outlined"
          onClick={fetchNotifications}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Filter by Type</InputLabel>
          <Select
            value={typeFilter}
            label="Filter by Type"
            onChange={e => setTypeFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="body2" color="text.secondary">
          {filtered.length} notification(s)
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress />
        </Box>
      ) : filtered.length === 0 ? (
        <Alert severity="info">No notifications found.</Alert>
      ) : (
        filtered.map(n => (
          <NotificationCard
            key={n.ID}
            notification={n}
            isNew={!viewedIds.has(n.ID)}
          />
        ))
      )}
    </Container>
  );
}

export default AllNotificationsPage;
