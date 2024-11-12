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
    const status = req.query.status ; // default to teachers if no status provided
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
      let bucketName = '';
      if (record.img_url) {
        if(status === 'notices'){
          bucketName = 'notices'
        }
        else{
          bucketName = 'users'
        }
        const imgaePath = bucketName + '/'+ status ;
         // Uses the status (teachers, students, notices etc)
        const { data: { publicUrl } } = supabaseClient.storage
          .from(imgaePath)
          .getPublicUrl(`${record.img_url.split('/').pop()}`);
        imageUrl = publicUrl;

        // const bucketName = 'users';
        // const folderPath = userRole.toLowerCase() + 's'; // 'students' or 'teachers'
        // const filePath = `${folderPath}/${fileName}`;
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
            subject: record.subject,
            img_url: imageUrl
          };
        case 'students':
          return {
            ...baseFormat,
            fullName: `${record.first_name} ${record.last_name}`,
            grade: record.grade,
            parentName: record.parent_name,
            img_url: imageUrl

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

// Add these new controller functions
const getExamTypes = async (req, res) => {
  try {
    const supabaseClient = await connectdb();
    const { data, error } = await supabaseClient
      .from('exams')
      .select('exam_type');

    if (error) throw error;

    // Extract unique exam types
    const uniqueExamTypes = [...new Set(data.map(item => item.exam_type))]
      .filter(Boolean) // Remove null/undefined values
      .map(type => ({
        id: type.toLowerCase().replace(/\s+/g, '-'), // Create an ID from the type
        name: type
      }));

    res.status(200).json(uniqueExamTypes);
  } catch (error) {
    console.error('Error fetching exam types:', error);
    res.status(500).json({ error: 'Failed to retrieve exam types' });
  }
};

const getClasses = async (req, res) => {
  try {
    const supabaseClient = await connectdb();
    const { data, error } = await supabaseClient
      .from('class')
      .select('class,sec');

    if (error) throw error;

    // Create a map to store classes and their sections
    const classMap = new Map();

    // Group sections by class
    data.forEach(item => {
      if (!item.class) return; // Skip if class is null/undefined
      
      if (!classMap.has(item.class)) {
        classMap.set(item.class, new Set());
      }
      if (item.sec) {
        classMap.get(item.class).add(item.sec);
      }
    });

    // Convert map to array and sort by class number
    const uniqueClasses = Array.from(classMap).map(([className, sections]) => ({
      id: className.toLowerCase().replace(/\s+/g, '-'),
      grade: className,
      sections: Array.from(sections).sort()
    })).sort((a, b) => {
      const gradeA = parseInt(a.grade.replace(/\D/g, ''));
      const gradeB = parseInt(b.grade.replace(/\D/g, ''));
      return gradeA - gradeB; 
    });   

    res.status(200).json(uniqueClasses);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Failed to retrieve classes' });
  }
};

module.exports = {
  getYears,
  getRecordsByYear,
  getExamTypes,
  getClasses
};