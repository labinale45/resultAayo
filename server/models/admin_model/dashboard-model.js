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

const getHistoricalData = async () => {
  try {
    const createClient = await connectdb();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    
    const { data: teacherData, error: teacherError } = await createClient
      .from("teachers")
      .select("created_at")
      .gte('created_at', sevenDaysAgo.toISOString());

    const { data: studentData, error: studentError } = await createClient
      .from("students")
      .select("created_at")
      .gte('created_at', sevenDaysAgo.toISOString());

    if (teacherError || studentError) {
      console.error("Error fetching historical data:", teacherError || studentError);
      throw new Error("Failed to fetch historical data");
    }

    // Group data by date
    const dailyCounts = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString();
      dailyCounts[dateStr] = { teachers: 0, students: 0 };
    }

    teacherData.forEach(record => {
      const date = new Date(record.created_at).toLocaleDateString();
      if (dailyCounts[date]) {
        dailyCounts[date].teachers++;
      }
    });

    studentData.forEach(record => {
      const date = new Date(record.created_at).toLocaleDateString();
      if (dailyCounts[date]) {
        dailyCounts[date].students++;
      }
    });

    return Object.entries(dailyCounts).reverse();
  } catch (error) {
    console.error("Error fetching historical data:", error);
    throw error;
  }
};

module.exports = {
  getTotalCount,
  getHistoricalData
}; 