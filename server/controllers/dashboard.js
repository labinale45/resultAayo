const { getTotalCount, getHistoricalData } = require('../models/admin_model/dashboard-model');

const dashboard = async(req, res) => {
  try {
    const { totalTeachers, totalStudents } = await getTotalCount();
    res.status(200).json({ totalTeachers, totalStudents });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
}

const getHistory = async(req, res) => {
  try {
    const { startDate, endDate, class: selectedClass } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const historicalData = await getHistoricalData(startDate, endDate, selectedClass);
    res.status(200).json(historicalData);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
}

module.exports = {
  dashboard,
  getHistory
}