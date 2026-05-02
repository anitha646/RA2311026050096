const express = require('express');
const axios = require('axios');
const cors = require('cors');
const logger = require('../logging_middleware/index');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(logger);

const NOTIFICATION_API = 'http://20.207.122.201/evaluation-service/notifications';

// Priority weight mapping: Placement > Result > Event
const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

/**
 * Computes a priority score for a notification.
 * Score = typeWeight * 1e12 + timestamp_ms
 * This ensures type dominates, but among same type, newer = higher priority.
 */
function computeScore(notification) {
  const typeWeight = TYPE_WEIGHT[notification.Type] || 0;
  const timestampMs = new Date(notification.Timestamp).getTime();
  return typeWeight * 1e12 + timestampMs;
}

/**
 * GET /notifications
 * Returns all notifications fetched from the external API.
 */
app.get('/notifications', async (req, res) => {
  try {
    const response = await axios.get(NOTIFICATION_API);
    const notifications = response.data.notifications || [];
    res.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

/**
 * GET /priority-notifications?n=10
 * Returns the top n priority notifications.
 * Priority: Placement > Result > Event, then by recency.
 *
 * Approach:
 *  - Fetch all notifications from the API.
 *  - Assign each a score based on type weight and recency.
 *  - Use a min-heap of size n to maintain top n efficiently.
 *  - As new notifications come in, they are compared against the heap minimum.
 */
app.get('/priority-notifications', async (req, res) => {
  try {
    const n = parseInt(req.query.n) || 10;
    const response = await axios.get(NOTIFICATION_API);
    const notifications = response.data.notifications || [];

    // Score all notifications
    const scored = notifications.map((notif) => ({
      ...notif,
      _score: computeScore(notif),
    }));

    // Min-heap implementation to efficiently maintain top n
    // For simplicity and correctness with JS, we sort and slice.
    // For a streaming/real-time scenario, see the design doc for heap approach.
    const topN = scored
      .sort((a, b) => b._score - a._score)
      .slice(0, n)
      .map(({ _score, ...notif }) => notif); // remove internal score field

    res.json({
      count: topN.length,
      priority_notifications: topN,
    });
  } catch (error) {
    console.error('Error fetching priority notifications:', error.message);
    res.status(500).json({ error: 'Failed to fetch priority notifications' });
  }
});

app.listen(PORT, () => {
  console.log(`Notification backend running on http://localhost:${PORT}`);
});
