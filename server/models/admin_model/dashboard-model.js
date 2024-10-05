const connectdb = require('../../utils/connectdb');
const dotenv = require('dotenv');

dotenv.config();

const getTotalCount = async () => {
  try {
    const createClient = await connectdb();
    const { count: teacherCount, error: teacherError } = await createClient
      .from("teachers")
      .select("*", { count: "exact" });

    if (teacherError) {
      console.error("Error fetching teacher count:", teacherError);
    }

    // Fetch student count
    const { count: studentCount, error: studentError } = await createClient
      .from("students")
      .select("*", { count: "exact" });

    if (studentError) {
      console.error("Error fetching student count:", studentError);
    }

    return { totalTeachers: teacherCount, totalStudents: studentCount };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error; // Re-throw the error to be handled by the API route
  }
};

// const getHistoricalData = async () => {
//   // Implement your logic to fetch historical data for the past 7 days
//   // Example:
//   const labels = ['2023-10-26', '2023-10-27', '2023-10-28', '2023-10-29', '2023-10-30', '2023-10-31', '2023-11-01'];
//   const data = [100, 120, 110, 130, 140, 150, 160]; // Replace with actual data

//   return { labels, data };
// };

module.exports = {
  getTotalCount,
  // getHistoricalData
}; 