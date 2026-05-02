import React, { useState, useEffect } from 'react';
import { Container, Typography, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';
import axios from 'axios';
import NotificationCard from '../components/NotificationCard';

const AllNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('All');
  const [viewed, setViewed] = useState([]);

  useEffect(() => {
    axios.get('/notifications')
      .then(res => {
        setNotifications(res.data.notifications);
      })
      .catch(err => console.error(err));
  }, []);

  const filtered = filter === 'All' 
    ? notifications 
    : notifications.filter(n => n.Type === filter);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom> All Notifications </Typography>
      
      <FormControl sx={{ mb: 3, minWidth: 200 }}>
        <InputLabel>Filter by Type</InputLabel>
        <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Placement">Placement</MenuItem>
          <MenuItem value="Result">Result</MenuItem>
          <MenuItem value="Event">Event</MenuItem>
        </Select>
      </FormControl>

      <Grid container spacing={2}>
        {filtered.map((notif, index) => (
          <Grid item xs={12} key={index}>
            <NotificationCard 
              notification={notif} 
              isNew={!viewed.includes(notif.Timestamp)} 
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AllNotificationsPage;
