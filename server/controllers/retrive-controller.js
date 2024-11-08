const connectdb = require('../utils/connectdb');

// Get years based on selected status (teachers, students, or staff)
const getYears = async (req, res) => {
  try {
    const supabaseClient = await connectdb();
    if (!supabaseClient) {
      console.error('Failed to connect to database');
      return res.status(500).json({ error: "Database connection failed" });
    }

    // Get status from query parameter
    const status = req.query.status || 'teachers'; // default to teachers if no status provided
    console.log('Fetching years for status:', status);

    const { data, error } = await supabaseClient
      .from(status)
      .select('created_at');

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    if (!data || !Array.isArray(data)) {
      console.error(`No ${status} data or invalid format:`, data);
      return res.status(500).json({ error: `Invalid data format from ${status} table` });
    }

    const uniqueYears = [...new Set(
      data.map(record => {
        const date = new Date(record.created_at);
        if (isNaN(date.getTime())) {
          console.error('Invalid date:', record.created_at);
          return null;
        }
        return date.getFullYear();
      }).filter(year => year !== null)
    )];

    const sortedYears = uniqueYears.sort((a, b) => b - a);
    return res.status(200).json(sortedYears);

  } catch (error) {
    console.error('Server error in getYears:', error);
    return res.status(500).json({ error: error.message || "Failed to retrieve years" });
  }
};

// Get records by year and status
const getRecordsByYear = async (req, res) => {
  try {
    const supabaseClient = await connectdb();
    const { year } = req.params;
    const status = req.query.status; 

    console.log(`Fetching ${status} for year:`, year);

    const { data, error } = await supabaseClient
      .from(status)
      .select('*')
      .gte('created_at', `${year}-01-01`)
      .lte('created_at', `${year}-12-31`);

    if (error) throw error;

    // Format data based on status
    const formattedData = data.map(record => {
      let imageUrl = null;
      if (record.img_url) {
        const { data: { publicUrl } } = supabaseClient.storage
          .from('notices')
          .getPublicUrl(record.img_url.split('/').pop()); // Get filename from URL
        imageUrl = publicUrl;
      }
      const baseFormat = {
        id: record.id,
        email: record.email,
        contact: record.phone_number,
        address: record.address,
        dateOfBirth: new Date(record.dob).toLocaleDateString(),
        username: record.username
      };

      // Add status-specific formatting
      switch(status) {
        case 'teachers':
          return {
            ...baseFormat,
            fullName: `${record.first_name} ${record.last_name}`,
            subject: record.subject
          };
        case 'students':
          return {
            ...baseFormat,
            fullName: `${record.first_name} ${record.last_name}`,
            grade: record.grade,
            parentName: record.parent_name
          };
        case 'notices':
          return {
            ...baseFormat,
            title: record.title,
            description: record.description,
            img_url: imageUrl,
            created_at: new Date(record.created_at).toLocaleDateString()
          };
        default:
          return baseFormat;
      }
    });

    res.status(200).json(formattedData);

  } catch (error) {
    console.error(`Error fetching ${req.query.status || 'records'}:`, error);
    res.status(500).json({ error: `Failed to retrieve ${req.query.status || 'records'}` });
  }
};

module.exports = {
  getYears,
  getRecordsByYear
  
};