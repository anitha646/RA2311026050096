import React, { useState, useEffect } from 'react';
import { Container, Typography, Slider, Grid, Box } from '@mui/material';
import axios from 'axios';
import NotificationCard from '../components/NotificationCard';

const PriorityInboxPage = () => {
  const [priorityNotifications, setPriorityNotifications] = useState([]);
  const [n, setN] = useState(10);
  const [viewed, setViewed] = useState([]);

  const fetchPriority = () => {
    axios.get('/priority-notifications?n=' + n)
      .then(res => {
        setPriorityNotifications(res.data.priority_notifications || []);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchPriority();
  }, [n]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom> Priority Inbox </Typography>
      
      <Box sx={{ width: 300, mb: 4 }}>
        <Typography gutterBottom>Show Top {n} Notifications</Typography>
        <Slider 
          value={n} 
          onChange={(e, newValue) => setN(newValue)} 
          min={5} 
          max={30} 
          step={1}
        />
      </Box>

      <Grid container spacing={2}>
        {priorityNotifications.map((notif, index) => (
          <Grid item xs={12} key={index}>
            <NotificationCard 
              notification={notif} 
              isNew={true} 
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PriorityInboxPage;
