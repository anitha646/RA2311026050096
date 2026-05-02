import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, CssBaseline } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AllNotificationsPage from './pages/AllNotificationsPage';
import PriorityInboxPage from './pages/PriorityInboxPage';

function App() {
  return (
    <Router>
      <CssBaseline />
      <AppBar position="static" sx={{ backgroundColor: '#1a237e' }}>
        <Toolbar>
          <NotificationsIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            AffordMed Notifications
          </Typography>
          <Button color="inherit" component={Link} to="/">
            All Notifications
          </Button>
          <Button color="inherit" component={Link} to="/priority">
            Priority Inbox
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <Routes>
          <Route path="/" element={<AllNotificationsPage />} />
          <Route path="/priority" element={<PriorityInboxPage />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
