// Simple Express server for room reviews
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// In-memory DB for demo (replace with MongoDB/Postgres for production)
const reviewsDB = {};

// Get reviews for a room
app.get('/api/reviews/:room', (req, res) => {
  const room = req.params.room;
  res.json(reviewsDB[room] || []);
});

// Add a new review to a room
app.post('/api/reviews/:room', (req, res) => {
  const room = req.params.room;
  const review = req.body;
  if (!reviewsDB[room]) reviewsDB[room] = [];
  reviewsDB[room].push(review);
  res.json({ success: true });
});

// Edit a review
app.put('/api/reviews/:room/:id', (req, res) => {
  const room = req.params.room;
  const id = parseInt(req.params.id);
  const updated = req.body;
  if (reviewsDB[room] && reviewsDB[room][id]) {
    reviewsDB[room][id] = updated;
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Review not found' });
  }
});

// Delete a review
app.delete('/api/reviews/:room/:id', (req, res) => {
  const room = req.params.room;
  const id = parseInt(req.params.id);
  if (reviewsDB[room] && reviewsDB[room][id]) {
    reviewsDB[room].splice(id, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Review not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Review API server running on port ${PORT}`);
});
