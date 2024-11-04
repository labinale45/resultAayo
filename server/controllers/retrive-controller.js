  const connectdb = require('../utils/connectdb');

  const getYears = async (req, res) => {
    try {
      const supabaseClient = await connectdb();
    
      // Get all teachers with their created_at dates
      const { data: teachers, error } = await supabaseClient
        .from('teachers')
        .select('created_at');

      if (error) throw error;

      // Extract years and remove duplicates
      const uniqueYears = [...new Set(
        teachers.map(teacher => new Date(teacher.created_at).getFullYear())
      )];

      // Sort years in descending order
      const sortedYears = uniqueYears.sort((a, b) => b - a);

      res.status(200).json(sortedYears);

    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve years" });
    }
  };

  module.exports = {
    getYears
  };
