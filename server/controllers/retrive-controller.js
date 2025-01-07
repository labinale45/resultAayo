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

    const studentIds = (studentData || []).map(student => student.id);
    
    console.log("Student Data:", studentData);
    // Start building the query
    let query = supabaseClient
      .from(status)
      .select(`*,student_id:users(
        email,
        username,
        password
        )`)
      .gte("created_at", `${year}-01-01`)
      .lte("created_at", `${year}-12-31`);

      //teacher
      if (status === "teachers") {
        query = query
        .select(`
        *,
        teacher_id:users (
          email,
          username,
          password,
          gender
        )
      `)
        .gte("created_at", `${year}-01-01`)
        .lte("created_at", `${year}-12-31`);
      }
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

    if (status === "ledgers" && classId && examType && year) {
      query = query.eq("class", classId)
      .eq("exam_type", examType)
      .gte("created_at", `${year}-01-01`)
      .lte("created_at", `${year}-12-31`)
      .select(`*`);
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
            email: record.teacher_id.email,
            password: record.teacher_id.password,
            username: record.teacher_id.username,
             tstatus: record.status,
             gender: record.teacher_id.gender,
          };
        case "students":
          return {
            ...baseFormat,
            fullName: `${record.first_name} ${record.last_name}`,
            grade: record.grade,
            parentName: record.parent_name,
            img_url: imageUrl,
            class: record.class,
            email: record.student_id.email,
            password: record.student_id.password,
            username: record.student_id.username,
            rollNo: record.rollNo,
            gender: record.student_id.gender,
            
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
            schoolName: record.schoolName,
            schoolAddress: record.schoolAddress,
            estdYear: record.estdYear,
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
    const {year} = req.params;
    
    console.log("Fetching classes for year:", year);

    const supabaseClient = await connectdb();
    const { data, error } = await supabaseClient
      .from("class")
      .select("class,sec")
      .gte("created_at", `${year}-01-01`)
      .lte("created_at", `${year}-12-31`);

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
  const { cls,subject,examType } = req.query; // Get the class from query parameters

  console.log("Fetching records for year:", year, "class:", cls,"Exam:",examType, "and subject:", subject);

  try {
    // Fetch records based on year and class
    const supabaseClient = await connectdb();
    const {data, error} = await supabaseClient
     .from("students")
     .select(`id,first_name,last_name, rollNo`)
     .eq("class", cls)
     .gte("created_at", `${year}-01-01`)
     .lte("created_at", `${year}-12-31`);

     if (error) throw error;
    
     if (!data || data?.length === 0) {

      return res.status(404).json({ error: "No records found for the given year and class" });
    }
    console.log("Fetched Student data:", data);

    const {data:classData, error: classError} = await supabaseClient
    .from("class")
    .select("id,class,sec")
    .eq("class", cls)
    .gte("created_at", `${year}-01-01`)
    .lte("created_at", `${year}-12-31`)
    .single();

    if (classError) throw classError;
    if (!classData || classData?.length === 0) {
      return res.status(404).json({ error: "No class data found for the given year and class" });
    }

    console.log("Fetched class data:", classData);

    const sanitizedSubject = subject.trim().toLowerCase();
    const {data: subjectData, error: subjectError} = await supabaseClient
    .from("subjects")
    .select("id,subject_name")
    .eq("subject_name", sanitizedSubject)
    .eq("class_id", classData.id)
    .single();

    if (subjectError) throw subjectError;
    if (!subjectData || subjectData?.length === 0) {
      return res.status(404).json({ error: "No subject data found for the given year, class, and subject" });
    }

    console.log("Fetched subject data:", subjectData);

    const {data: examTypeData, error: examTypeError} = await supabaseClient
    .from("exams")
    .select("id,exam_type")
    .eq("exam_type", examType)
    .gte("created_at", `${year}-01-01`)
    .lte("created_at", `${year}-12-31`)
    .single();

    if (examTypeError) throw examTypeError;
    if (!examTypeData || examTypeData?.length === 0) {
      return res.status(404).json({ error: "No exam type data found for the given year, class, and exam type" });
    }

    console.log("Fetched exam type data:", examTypeData);


    const studentIds = data.map(student => student.id);
    console.log("Student IDs:", studentIds);

    const {data: marksData, error: marksError} = await supabaseClient
    .from("marksheets")
    .select("student_id,id,TH,PR")
    .in("student_id", studentIds)
    .eq("subject_id", subjectData.id)
    .eq("class",cls)
    .eq("exam_id", examTypeData.id)
    .gte("created_at", `${year}-01-01`)
    .lte("created_at", `${year}-12-31`);

    if (marksError) throw marksError;
    if (!marksData || marksData?.length === 0) {
      return res.status(404).json({ error: "No marks data found for the given year, class, subject, and exam type" });
    }
    console.log("Fetched marks data:", marksData);

    const {data: markSetupData, error: markSetupError} = await supabaseClient
    .from("markSetup")
    .select("setup_id,PM,FM")
    .eq("class_id", classData.id)
    .eq("subject_id", subjectData.id)
    .eq("id", examTypeData.id)
    .gte("created_at", `${year}-01-01`)
    .lte("created_at", `${year}-12-31`);
    
    if (!markSetupData || markSetupData?.length === 0) {
      return res.status(404).json({ error: "No mark setup data found for the given year, class, subject, and exam type" });
    }

    if (markSetupError) throw markSetupError;

  
    console.log("Fetched mark setup data:", markSetupData);

    // Attach marks data to each student
    const studentsWithMarks = data.map(student => {
      const studentMarks = marksData.filter(mark => mark.student_id === student.id);
      console.log("Student marks:", studentMarks);
      return {
        ...student,
        marks: studentMarks
      };
    });
    console.log("Students with marks:", studentsWithMarks);
  
    res.status(200).json({
      students: studentsWithMarks,
      class: classData,
      subject: subjectData,
      examType: examTypeData,
      marks: marksData,
      markSetup: markSetupData,
    });

  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).json({ error: "Failed to fetch records" });
  }
};

const getGradesheet = async (req, res) => {
  try {
    const supabaseClient = await connectdb();
    const { year } = req.params;
    const { status, class: classId, examType, studentId } = req.query;

    console.log(`Fetching gradesheet for status: ${status}, year: ${year}, class: ${classId}, examType: ${examType}, studentId: ${studentId}`);

   
    // First get exam data
    const { data: examData, error: examError } = await supabaseClient
      .from("exams")
      .select("id")
      .eq("exam_type", examType)
      .gte("created_at", `${year}-01-01`)
      .lte("created_at", `${year}-12-31`)
      .single();

    if (examError) throw examError;

    console.log("Exam Data:", examData);

    const { data: studentData, error: studentError } = await supabaseClient
    .from('students')
    .select('id')
    .eq('student_id', studentId)
    .single();

    if (studentError) {
        console.error("Student Query Error: ", studentError);
        throw studentError;
    }
    if (!studentData || studentData.length === 0) {
        console.warn("No Student data found.");
        return [];
    }

    console.log("Student Data:", studentData);

    // Then get the marksheet data with all related information
    const { data, error } = await supabaseClient
      .from('marksheets')
      .select(`
        *,
        student_id:students(
          first_name, 
          last_name, 
          rollNo, 
          dob
        ),
        subject_id:subjects(
          subject_name
        ),
        exam_id:exams(
          exam_type
        )
      `)
      .eq('class', classId)
      .eq('student_id', studentData.id)
      .eq('exam_id', examData.id)
      .gte('created_at', `${year}-01-01`)
      .lte('created_at', `${year}-12-31`);

    if (error) throw error;

    console.log("Marksheet Data:", data);
    // Get school information
    // const { data: schoolData, error: schoolError } = await supabaseClient
    //   .from('school_info')
    //   .select('*')
    //   .single();

    // if (schoolError) throw schoolError;

    // Format the response
    const formattedData = {
      schoolName: data[0]?.schoolName || "School Name",
      schoolAddress: data[0]?.schoolAddress || "School Address",
      estdYear: data[0]?.estdYear || "Established Year",
      students: data[0]?.student_id.first_name + " " + data[0]?.student_id.last_name,
      dateOfBirth: data[0]?.student_id.dob,
      dateOfBirthAD: data[0]?.student_id.dateOfBirthAD,
      rollNo: data[0]?.student_id.rollNo,
      subjects: data.map(mark => ({
        name: mark.subject_id.subject_name,
        th: {
          creditHour: mark.TH_credit_hour,
          gpa: mark.TH_gpa,
          grade: mark.TH_grade
        },
        pr: {
          creditHour: mark.PR_credit_hour,
          gpa: mark.PR_gpa,
          grade: mark.PR_grade
        },
        finalGrade: mark.final_grade,
        remarks: mark.remarks
      }))
    };

    res.status(200).json(formattedData);
    
    console.log("Formatted Data:", formattedData);
  } catch (error) {
    console.error('Error fetching gradesheet:', error);
    res.status(500).json({ error: 'Failed to fetch gradesheet' });
  }
};


module.exports = {
  getGradesheet,
  getRecordsByYearAndClass,
  getYears,
  getRecordsByYear,
  getExamTypes,
  getClasses,
};


