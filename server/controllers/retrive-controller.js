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

  const getTeachersByYear = async (req, res) => {
    try {
      const supabaseClient = await connectdb();
      const year = req.params.year;
  
      const { data: teachers, error } = await supabaseClient
        .from('teachers')
        .select('*')
        .gte('created_at', `${year}-01-01`)
        .lte('created_at', `${year}-12-31`);
  
      if (error) throw error;
  
      const formattedTeachers = teachers.map(teacher => ({
        id: teacher.id,
        fullName: `${teacher.first_name} ${teacher.last_name}`,
        email: teacher.email,
        contact: teacher.phone_number,
        address: teacher.address,
        dateOfBirth: new Date(teacher.dob).toLocaleDateString(),
        username: teacher.username
      }));
  
      res.status(200).json(formattedTeachers);
  
    } catch (error) {
      console.error('Error fetching teachers:', error);
      res.status(500).json({ error: "Failed to retrieve teachers" });
    }
  };
  
  
  module.exports = {
    getYears,
    getTeachersByYear
  };