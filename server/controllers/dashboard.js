const { getTotalCount } = require('../models/admin_model/dashboard-model');
const dashboard = async(req, res)=>{
  try {
    const { totalTeachers, totalStudents } = await getTotalCount();
    res.status(200).json({ totalTeachers, totalStudents });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
}
module.exports = {
  dashboard
}