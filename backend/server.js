const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
const analyticsRoutes = require('./routes/analytics');
const insightsRoutes = require('./routes/insights');
const recommendationsRoutes = require('./routes/recommendations');
const exportRoutes = require('./routes/export');

app.use('/api/analytics', analyticsRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/export', exportRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'UP', message: 'Hotel Intelligence Analytics Platform API is running smoothly' });
});

app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` Hotel Intelligence Analytics Platform API running on port ${PORT} `);
    console.log(`=======================================================`);
});
