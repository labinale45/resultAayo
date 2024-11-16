const connectdb = require('../../utils/connectdb');
const dotenv = require('dotenv');

dotenv.config();

const getTotalCount = async () => {
  try {
    const createClient = await connectdb();
    
    const [{ count: totalTeachers }, { count: totalStudents }] = await Promise.all([
      createClient.from('teachers').select('*', { count: 'exact', head: true }),
      createClient.from('students').select('*', { count: 'exact', head: true })
    ]);

    return { totalTeachers, totalStudents };
  } catch (error) {
    console.error("Error getting total counts:", error);
    throw error;
  }
};

const getHistoricalData = async (startDate, endDate, selectedClass) => {
  try {
    const createClient = await connectdb();
    
    // Get all teachers and students within date range
    const teacherQuery = createClient
      .from("teachers")
      .select("*")
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    const studentQuery = createClient
      .from("students")
      .select("*")
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (selectedClass) {
      studentQuery.eq('grade', selectedClass);
    }

    const [teacherResult, studentResult] = await Promise.all([teacherQuery, studentQuery]);

    if (teacherResult.error || studentResult.error) {
      throw new Error(teacherResult.error || studentResult.error);
    }

    // Create a map of dates
    const dateMap = new Map();
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      dateMap.set(dateStr, {
        date: dateStr,
        counts: { teachers: 0, students: 0 }
      });
    }

    // Count teachers per day
    teacherResult.data.forEach(teacher => {
      const date = new Date(teacher.created_at).toISOString().split('T')[0];
      if (dateMap.has(date)) {
        dateMap.get(date).counts.teachers++;
      }
    });

    // Count students per day
    studentResult.data.forEach(student => {
      const date = new Date(student.created_at).toISOString().split('T')[0];
      if (dateMap.has(date)) {
        dateMap.get(date).counts.students++;
      }
    });

    // Convert map to array and sort by date
    return Array.from(dateMap.values()).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
  } catch (error) {
    console.error("Error in getHistoricalData:", error);
    throw error;
  }
};

module.exports = {
  getHistoricalData,
  getTotalCount
}; 