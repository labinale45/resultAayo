const connectdb = require('../utils/connectdb');
const dotenv = require('dotenv');

dotenv.config();

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

const upcomingExams = async(req, res) => {
  try {
    const { year } = req.params;
    const supabaseClient = await connectdb();
    const currentDate = new Date();

    const { data: exams, error } = await supabaseClient
      .from('exams')
      .select('*')
      .gte('deadline_date', currentDate.toISOString())
      .order('deadline_date', { ascending: true });

    if (error) throw error;

    const { data: pastExams, error: pastError } = await supabaseClient
      .from('exams')
      .select('*')
      .lt('deadline_date', currentDate.toISOString())
      .order('deadline_date', { ascending: false });

    if (pastError) throw pastError;

    console.log('upcoming, past and count:', exams, pastExams, exams?.length);
    res.status(200).json({ 
      upcomingExams: exams || [],
      pastExams: pastExams || [],
      upcomingCount: exams?.length || 0
    });
  } catch (error) {
    console.error('Error fetching upcoming exams:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming exams' });
  }
}


module.exports = {
  upcomingExams,
  dashboard,
  getHistory
}