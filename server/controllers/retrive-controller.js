const connectdb = require("../utils/connectdb");

// Get years based on selected status (teachers, students, or staff)
const getYears = async (req, res) => {
  try {
    const supabaseClient = await connectdb();
    if (!supabaseClient) {
      console.error("Failed to connect to database");
      return res.status(500).json({ error: "Database connection failed" });
    }

    // Get status from query parameter
    const status = req.query.status; // default to teachers if no status provided
    console.log("Fetching years for status:", status);

    const { data, error } = await supabaseClient
      .from(status)
      .select("created_at");

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    if (!data || !Array.isArray(data)) {
      console.error(`No ${status} data or invalid format:`, data);
      return res
        .status(500)
        .json({ error: `Invalid data format from ${status} table` });
    }

    const uniqueYears = [
      ...new Set(
        data
          .map((record) => {
            const date = new Date(record.created_at);
            if (isNaN(date.getTime())) {
              console.error("Invalid date:", record.created_at);
              return null;
            }
            return date.getFullYear();
          })
          .filter((year) => year !== null)
      ),
    ];

    const sortedYears = uniqueYears.sort((a, b) => b - a);
    return res.status(200).json(sortedYears);
  } catch (error) {
    console.error("Server error in getYears:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to retrieve years" });
  }
};

// Get records by year and status
const getRecordsByYear = async (req, res) => {
  try {
    const supabaseClient = await connectdb();
    const { year } = req.params;
    const status = req.query.status;
    const classId = req.query.class;
    const examType = req.query.examType;

    console.log(`Fetching ${status} for year:`, year, `and class ID:`, classId, `and exam type:`, examType);

    const {data: examData, error: examError} = await supabaseClient
    .from("exams")
    .select("*")
    .eq("exam_type", examType)
    .gte("created_at", `${year}-01-01`)
    .lte("created_at", `${year}-12-31`)
    .single();

    console.log("Exam Data:", examData);

    const {data:studentData, error: studentError} = await supabaseClient
    .from("students")
    .select("*")
    .eq("class", classId)
    .gte("created_at", `${year}-01-01`)
    .lte("created_at", `${year}-12-31`);

    const studentIds = studentData.map(student => student.id);

    console.log("Student Data:", studentData);
    // Start building the query
    let query = supabaseClient
      .from(status)
      .select("*")
      .gte("created_at", `${year}-01-01`)
      .lte("created_at", `${year}-12-31`);

    // Add class filter only for students
    if (status === "students" && classId) {
      query = query.eq("class", classId);
    }
    if (status === "marksheets" && classId && examType && year) {

      if (!examData || !studentData || studentData.length === 0) {
        console.error("Exam data or student data is undefined or empty");
        return res.status(400).json({ error: "Invalid exam or student data" });
      }
      
      // Ensure studentIds is an array and not empty
      if (!Array.isArray(studentIds) || studentIds.length === 0) {
        console.error("No valid student IDs found");
        return res.status(400).json({ error: "No valid student IDs found" });
      }

      query = query.eq("class", classId)
      .eq("exam_id", examData.id)
      .in("student_id", studentIds) // Ensure this is an array
      .gte("created_at", `${year}-01-01`)
      .lte("created_at", `${year}-12-31`)
      .select(`*,student_id:students(first_name,last_name,rollNo), subject_id:subjects(subject_name), exam_id:exams(exam_type)`);
    }
    const { data, error } = await query;

    console.log("Query result:", data);
    if (error) throw error;

    // Format data based on status
    const formattedData = data.map((record) => {
      let imageUrl = null;
      let bucketName = "";
      if (record.img_url) {
        if (status === "notices") {
          bucketName = "notices";
        } else {
          bucketName = "users";
        }
        const imgaePath = bucketName + "/" + status;
        // Uses the status (teachers, students, notices etc)
        const {
          data: { publicUrl },
        } = supabaseClient.storage
          .from(imgaePath)
          .getPublicUrl(`${record.img_url.split("/").pop()}`);
        imageUrl = publicUrl;
      }
      const baseFormat = {
        id: record.id || "",	
        email: record.email || "",
        contact: record.phone_number || "",
        address: record.address || "",
        dateOfBirth: new Date(record.dob).toLocaleDateString() || "",
        username: record.username || "",
      };

      // Add status-specific formatting
      switch (status) {
        case "teachers":
          return {
            ...baseFormat,
            fullName: `${record.first_name} ${record.last_name}`,
            subject: record.subject,
            img_url: imageUrl,
             tstatus: record.status,
          };
        case "students":
          return {
            ...baseFormat,
            fullName: `${record.first_name} ${record.last_name}`,
            grade: record.grade,
            parentName: record.parent_name,
            img_url: imageUrl,
            class: record.class,
            rollNo: record.rollNo,
            
          };
        case "notices":
          return {
            ...baseFormat,
            title: record.title,
            description: record.description,
            img_url: imageUrl,
            created_at: new Date(record.created_at).toLocaleDateString(),
          };
        case "ledgers":
          return {
            ...baseFormat,
            year: record.year,
            class: record.class,
            exam_type: record.exam_type,
            students: record.students,
            isPublished: record.isPublished,
            created_at: new Date(record.created_at).toLocaleDateString(),
          };
          case "marksheets":
          return {
            ...baseFormat,
            year: record.year,
            class: record.class,
            rollNo: record.student_id.rollNo || "",	
            subjects: record.subject_id.subject_name || "",
            students: record.student_id.first_name+ " " +record.student_id.last_name|| "", 
            exam_type: record.exam_id.exam_type || "",
            TH: record.TH,
            PR: record.PR,
            created_at: new Date(record.created_at).toLocaleDateString(),
          };
        default:
          return baseFormat;
      }
    });

    res.status(200).json(formattedData);
  } catch (error) {
    console.error(`Error fetching ${req.query.status || "records"}:`, error);
    res
      .status(500)
      .json({ error: `Failed to retrieve ${req.query.status || "records"}` });
  }
};

// Add these new controller functions
const getExamTypes = async (req, res) => {
  try {
    const year = req.query.year; // Get the year from the query parameters
    console.log("Fetching exam types for year:", year);

    // Validate the year
    if (!year) {
      return res.status(400).json({ error: "Year is required" });
    }

    const startDate = `${year}-01-01`; // Start of the year
    const endDate = `${year}-12-31`; // End of the year

    const supabaseClient = await connectdb();

    const { data, error } = await supabaseClient
      .from("exams")
      .select("exam_type")
      .gte("created_at", startDate) // Use dynamic start date
      .lte("created_at", endDate); // Use dynamic end date

    if (error) throw error;

    // Extract unique exam types
    const uniqueExamTypes = [...new Set(data.map((item) => item.exam_type))]
      .filter(Boolean) // Remove null/undefined values
      .map((type) => ({
        id: type.toLowerCase().replace(/\s+/g, "-"), // Create an ID from the type
        name: type,
      }));

    res.status(200).json(uniqueExamTypes);
  } catch (error) {
    console.error("Error fetching exam types:", error);
    res.status(500).json({ error: "Failed to retrieve exam types" });
  }
};

const getClasses = async (req, res) => {
  try {
    const supabaseClient = await connectdb();
    const { data, error } = await supabaseClient
      .from("class")
      .select("class,sec");

    if (error) throw error;

    // Create a map to store classes and their sections
    const classMap = new Map();

    // Group sections by class
    data.forEach((item) => {
      if (!item.class) return; // Skip if class is null/undefined

      if (!classMap.has(item.class)) {
        classMap.set(item.class, new Set());
      }
      if (item.sec) {
        classMap.get(item.class).add(item.sec);
      }
    });

    // Convert map to array and sort by class number
    const uniqueClasses = Array.from(classMap)
      .map(([className, sections]) => ({
        id: className.toLowerCase().replace(/\s+/g, "-"),
        grade: className,
        sections: Array.from(sections),
      }))
      .sort((a, b) => {
        const gradeA = parseInt(a.grade.replace(/\D/g, ""));
        const gradeB = parseInt(b.grade.replace(/\D/g, ""));
        return gradeA - gradeB;
      });

    res.status(200).json(uniqueClasses);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ error: "Failed to retrieve classes" });
  }
};

const getRecordsByYearAndClass = async (req, res) => {
  const { year } = req.params;
  const { cls } = req.query; // Get the class from query parameters

  console.log("Fetching records for year:", year, "and class:", cls);

  try {
    // Fetch records based on year and class
    const supabaseClient = await connectdb();
    const {data, error} = await supabaseClient
     .from("students")
     .select(`id,first_name,last_name, rollNo`)
     .eq("class", cls)
     .gte("created_at", `${year}-01-01`)
     .lte("created_at", `${year}-12-31`);


     console.log("Fetched data:", data);
     if (error) throw error;
    
     if (!data || data.length === 0) {

      return res.status(404).json({ error: "No records found for the given year and class" });
    }
  
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).json({ error: "Failed to fetch records" });
  }
};

module.exports = {
  getRecordsByYearAndClass,
  getYears,
  getRecordsByYear,
  getExamTypes,
  getClasses,
};


