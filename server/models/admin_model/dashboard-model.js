
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
    
    // Adjust endDate to include the current date
    const currentDate = new Date();
    endDate = currentDate.toISOString().split('T')[0]; // Set endDate to today

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

    // Create a map of dates with cumulative counts
    const dateMap = new Map();
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Initialize cumulative counters
    let cumulativeTeachers = 0;
    let cumulativeStudents = 0;

    // Iterate through dates and track cumulative counts
    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      
      // Count new teachers on this date
      const newTeachersOnDate = teacherResult.data.filter(
        teacher => new Date(teacher.created_at).toISOString().split('T')[0] === dateStr
      ).length;

      // Count new students on this date
      const newStudentsOnDate = studentResult.data.filter(
        student => new Date(student.created_at).toISOString().split('T')[0] === dateStr
      ).length;

      // Update cumulative counts
      cumulativeTeachers += newTeachersOnDate;
      cumulativeStudents += newStudentsOnDate;

      // Store cumulative counts for the date
      dateMap.set(dateStr, {
        date: dateStr,
        counts: { 
          teachers: cumulativeTeachers, 
          students: cumulativeStudents 
        }
      });
    }

    // Convert map to array and sort by date
    return Array.from(dateMap.values()).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
  } catch (error) {
    console.error("Error in getHistoricalData:", error);
    throw error;
  }
};

// const getExamsCount = async () => {
//   try {
//     const createClient = await connectdb();
//     const currentDate = new Date();
    
//     const { data: upcomingExams, error } = await createClient
//       .from('exams')
//       .select('*', { count: 'exact' })
//       .gte('deadline_date', currentDate.toISOString());

//     if (error) throw error;

//     return { upcomingExamsCount: upcomingExams.length };
//   } catch (error) {
//     console.error("Error getting exams count:", error);
//     throw error;
//   }
// };

module.exports = {

  getHistoricalData,
  getTotalCount
}; 