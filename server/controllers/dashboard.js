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
    
    // Set default startDate to 7 days ago if not provided
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    const start = startDate || sevenDaysAgo.toISOString().split('T')[0];
    const end = endDate || today.toISOString().split('T')[0];

    const historicalData = await getHistoricalData(start, end, selectedClass);
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