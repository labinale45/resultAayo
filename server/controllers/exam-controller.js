const connectdb = require('../utils/connectdb');
const dotenv = require('dotenv');
dotenv.config();

// Initialize Supabase client


const createExam = async (req, res) => {

    try {
        const { examType, ddate,dtime,rdate,rtime} = req.body;
        const createClient = await connectdb();
        
        const {data,error} = await createClient
        .from('exams')
        .insert({
            exam_type: examType,
            deadline_date: ddate,
            deadline_time: dtime,
            resultDate: rdate,
            resultTime: rtime,
            created_at: new Date().toISOString()
        });
        if (error){
          console.error('Error creating Exam:', error.message);
          throw error;
        }
        return res.status(200).json({message: examType + " created successfully"});
}
    catch (error) {
        console.error('Error creating Exam:', error.message);
        throw error;
    }
}

const createNotice = async (req, res) => {
    try {
        const { title, description, image } = req.body;
        const createClient = await connectdb();
        
        if (!title || !description) {
            return res.status(400).json({ 
                message: "Title and description are required" 
            });
        }

        let imageUrl = null;
        
        if (image) {
            try {
                // Convert base64 to buffer
                const buffer = Buffer.from(
                    image.replace(/^data:image\/\w+;base64,/, ''),
                    'base64'
                );

                // Generate unique filename with original file extension
                const matches = image.match(/^data:image\/([A-Za-z-+\/]+);base64,/);
                const fileExtension = matches ? matches[1].replace('+', '') : 'jpg';
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
                const filePath = `notices/${fileName}`;

                // Upload to Supabase storage with correct content type
                const { error: uploadError } = await createClient.storage
                    .from('notices')
                    .upload(filePath, buffer, {
                        contentType: `image/${fileExtension}`,
                        upsert: false
                    });

                if (uploadError) throw uploadError;

                // Get public URL with complete URL path
                const { data: urlData } = await createClient.storage
                    .from('notices')
                    .getPublicUrl(filePath);

                // Make sure we have the complete URL from Supabase
                imageUrl = urlData.publicUrl;
                
                // Verify the URL is complete and accessible
                if (!imageUrl.startsWith('http')) {
                    // If needed, construct the full Supabase URL
                    imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/notices/${filePath}`;
                }

                console.log('Final imageUrl:', imageUrl);
            } catch (uploadError) {
                console.error('Error uploading image:', uploadError);
                return res.status(500).json({
                    message: "Failed to upload image",
                    error: uploadError.message
                });
            }
        }

        const { data, error } = await createClient
            .from('notices')
            .insert({
                title: title,
                description: description,
                img_url: imageUrl,
                created_at: new Date().toISOString()
            });

        if (error) {
            console.error('Error creating Notice:', error.message);
            return res.status(500).json({ 
                message: "Failed to create notice", 
                error: error.message 
            });
        }

        return res.status(200).json({ 
            message: title + " created successfully",
            imageUrl: imageUrl
        });
    } catch (error) {
        console.error('Error creating Notice:', error.message);
        return res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
}

const getLedgerStatus = async (req, res) => {
  try {
    const supabaseClient = await connectdb();
    const { year, class: className, examType } = req.body;

    const { data, error } = await supabaseClient
      .from('ledgers')
      .select('isPublished')
      .eq('year', year)
      .eq('class', className)
      .eq('exam_type', examType)
      .single();

    if (error) throw error;

    res.status(200).json({ isPublished: data?.isPublished || false });
  } catch (error) {
    console.error('Error checking ledger status:', error);
    res.status(500).json({ error: 'Failed to check ledger status' });
  }
};


const setupMarks = async (req, res) => {
    try {
        const { year, examType, subjects, fullMarks, passMarks } = req.body;
        const createClient = await connectdb();
        console.log("Received request to enter marks:", req.body);
        
        // Fetch exam ID
        const { data: examData, error: examError } = await createClient
            .from('exams')
            .select('id')
            .eq('exam_type', examType)
            .gte('created_at', `${year}-01-01`)
            .lte('created_at', `${year}-12-31`)
            .single();

        if (examError || !examData) {
            return res.status(400).json({ message: "Exam not found" });
        }

        const examId = examData.id;

        // Fetch class IDs for each subject based on subject ID
        const classIds = await Promise.all(subjects.map(async (subjectId) => {
            const { data, error } = await createClient
                .from('subjects')
                .select('class_id') // Selecting class_id based on subject ID
                .eq('id', subjectId.id)
                .single();

            if (error || !data) {
                throw new Error(`Class not found for subject ID: ${subjectId.subject_name}`);
            }
            return data.class_id;
        }));

        // Prepare markSetupData for upsert
        const markSetupData = subjects.map((subjectId, index) => ({
            id: examId,
            class_id: classIds[index],
            subject_id: subjectId.id, // Mapping only subject_id
            FM: fullMarks[index],
            PM: passMarks[index],
            created_at: new Date().toISOString()
        }));

        // Log the markSetupData to check for undefined values
        console.log("Mark Setup Data:", markSetupData);

        // Upsert logic
        for (const mark of markSetupData) {
            const { id, class_id, subject_id, FM, PM } = mark;

            // Check for undefined values
            if (!subject_id || !class_id || !id) {
                console.error('Invalid data found:', mark);
                throw new Error('One or more required fields are undefined.');
            }

            // Check if the record already exists
            const { data: existingData, error: existingError } = await createClient
                .from('markSetup')
                .select('*')
                .eq('id', id)
                .eq('class_id', class_id)
                .eq('subject_id', subject_id)
                .limit(1)
                .single();

            if (existingError) {
                // Handle the case where no records are found
                if (existingError.code === 'PGRST116') { // No rows found
                    // Proceed to insert a new record
                } else {
                    throw existingError; // Other errors
                }
            }

            if (existingData) {
                // Update existing record
                const { error: updateError } = await createClient
                    .from('markSetup')
                    .update({ FM, PM })
                    .eq('id', existingData.id)
                    .eq('class_id',existingData.class_id)
                    .eq('subject_id',existingData.subject_id); // Assuming 'id' is the primary key

                if (updateError) {
                    throw updateError;
                }
            } else {
                // Insert new record
                const { error: insertError } = await createClient
                    .from('markSetup')
                    .insert(mark);

                if (insertError) {
                    throw insertError;
                }
            }
        }

        return res.status(200).json({
            message: "Mark setup updated successfully"
        });
    } catch (error) {
        console.error('Error entering mark setup:', error.message);
        return res.status(500).json({
            message: "Failed to enter mark setup",
            error: error.message
        });
    }
};

const getMarksData = async (req, res) => {
    try {
        const { year, examType, classes } = req.query;
    console.log('Received parameters:', { year, examType, classes});
        
        const createClient = await connectdb();
        console.log('Database connection established.');

        if (!year || !examType || !classes) {
            return res.status(400).json({ message: "Year, examType, and class are required." });
        }

        const {data:classData, error: classError}= await createClient
        .from('class')
        .select('id')
        .eq('class', classes)
        .gte('created_at', `${year}-01-01`)
        .lte('created_at', `${year}-12-31`);

        if (classError || !classData || classData.length === 0) {
            console.error('No class data found or error occurred:', classError);
            return res.status(400).json({ message: "No class data found for the given parameters." });
        }

        const {data:examData, error: examError}= await createClient
        .from('exams')
        .select('id')
        .eq('exam_type', examType)
        .gte('created_at', `${year}-01-01`)
        .lte('created_at', `${year}-12-31`);

        if (examError || !examData || examData.length === 0) {
            console.error('No exam data found or error occurred:', examError);
            return res.status(400).json({ message: "No exam data found for the given parameters." });
        }

        const {data:subjectData, error: subjectError}= await createClient
        .from('subjects')
        .select('id')
        .eq('class_id', classData[0].id)
        .gte('created_at', `${year}-01-01`)
        .lte('created_at', `${year}-12-31`);

        if (subjectError || !subjectData || subjectData.length === 0) {
            console.error('No subject data found or error occurred:', subjectError);
            return res.status(400).json({ message: "No subject data found for the given parameters." });
        }

        const { data, error } = await createClient
            .from('markSetup')
            .select('id, class_id, subject_id, FM, PM, subjects(subject_name)') 
            .gte('created_at', `${year}-01-01`)
            .lte('created_at', `${year}-12-31`)
            .eq('class_id', classData[0].id)
            .eq('id', examData[0].id);

        if (error) {
            console.error('Database query error:', error.message);
            throw error; // This will be caught in the catch block
        }

        if (!data || data.length === 0) {
            console.log('No data found for the given parameters.');
            return res.status(200).json([]); // Return an empty array if no data found
        }

        console.log('Data fetched successfully:', data);
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching marks data:', error.message);
        return res.status(500).json({ message: "Failed to fetch marks data", error: error.message });
    }
};

const getSubjectsByClass = async (req, res) => {
    try {
        const { classId, year } = req.query; // Get classId and year from query parameters
        const createClient = await connectdb();

        console.log(classId, year);
        // Get the class ID using class, section, and year from updated_at
        const { data: classData, error: classError } = await createClient
            .from('class')
            .select('id')
            .eq('class', classId)
            .gte('updated_at', `${year}-01-01`)
            .lte('updated_at', `${year}-12-31`);

        if (classError) throw classError;
        if (!classData || classData.length === 0) {
            return res.status(404).json({ message: "No class found" }); // Return 404 if no class found
        }

        // Fetch subjects based on class_id
        const { data: subjectsData, error: subjectsError } = await createClient
            .from('subjects')
            .select('id, subject_name')
            .eq('class_id', classData[0].id); // Fetch subjects based on class_id

        if (subjectsError) throw subjectsError;
        console.log(subjectsData);
        return res.status(200).json(subjectsData); // Return subjects data
    } catch (error) {
        console.error("Error fetching subjects:", error.message);
        return res.status(500).json({ message: "Failed to fetch subjects", error: error.message });
    }
};

const getAssignedSubjects = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const createClient = await connectdb();

        const {data: teacherData, error: teacherError } = await createClient
        .from('teachers')
        .select('id')
        .eq('teacher_id', teacherId)


        if (teacherError) throw teacherError;
        if (!teacherData || teacherData.length === 0) {
            return res.status(404).json({ message: "No teacher found" }); // Return 404 if no teacher found
        }

        const { data: subjectData, error: subjectError } = await createClient
        .from('subjects')
        .select('subject_name')
        .eq('teacher_id', teacherData[0].id);
        if (subjectError) throw subjectError;

        if (subjectData.length === 0) {
            console.warn("No classes assigned for this teacher.");
        }

         // Use a Set to track unique classes
    const uniqueSubject = new Set();

    // Map the assignedClass data and add unique classes to the Set
    const subjects = (subjectData || []).map(item => {
      const subject = item.subject_name || '';
      if (subject) {
        uniqueSubject.add(subject); // Add to Set for uniqueness
      }
     return subject; // Return the subject name
      
    });
    // Convert the Set back to an array
     const uqSubject = Array.from(uniqueSubject); // Return unique class names
     console.log(uqSubject);
     return res.status(200).json(uqSubject); // Return the unique classes

    }catch (error) {
        console.error("Error fetching subjects:", error.message);
        return res.status(500).json({ message: "Failed to fetch subjects", error: error.message });
    }
};

const enterMarks = async (req, res)=>{
    try{
        const {year, examType , className, subject,marks} = req.body;
        const createClient = await connectdb();

        console.log(year, examType, className, subject,marks);



        const {data: examData, error: examError} = await createClient 
        .from('exams')
        .select('id')
        .eq('exam_type', examType)
        .gte('created_at', `${year}-01-01`)
        .lte('created_at', `${year}-12-31`)
        .single();

        console.log("examData: ",examData);

        if (examError) throw examError;
        if (!examData || examData.length === 0) {
            return res.status(404).json({ message: "No exam found" }); // Return 404 if no exam found
        }

        

        const {data: classData, error: classError} = await createClient
        .from('class')
        .select('id')
        .eq('class', className)
        .gte('updated_at', `${year}-01-01`)
        .lte('updated_at', `${year}-12-31`)
        .single();

        console.log("classData: ",classData);

        if (classError) throw classError;
        if (!classData || classData.length === 0) {
            return res.status(404).json({ message: "No class found" }); // Return 404 if no class found
        }


        const {data: subjectData, error: subjectError} = await createClient
        .from('subjects')
        .select('id')
        .eq('subject_name', subject)
        .eq('class_id', classData.id)
        .single();


        console.log("subjectData: ",subjectData);

        if (subjectError) throw subjectError;
        if (!subjectData || subjectData.length === 0) {
            return res.status(404).json({ message: "No subject found" }); // Return 404 if no subject found
        }

       

        const {data: studentData, error: studentError} = await createClient
        .from('students')
        .select('id')
        .eq('class_id', classData.id)
        .in('rollNo', marks.map(mark => mark.rollNo));

        console.log("studentData: ",studentData);

        if (studentError) throw studentError;
        if (!studentData || studentData.length === 0) {
            return res.status(404).json({ message: "No student found" }); // Return 404 if no student found
        }


         // Prepare markSetupData for upsert
         const markSheetsData = marks.map((mark, index) => ({
            class: className,
            student_id: studentData.map(student => student.id)[index], // Mapping only student_id
            subject_id: subjectData.id, // Mapping only subject_id
            exam_id: examData.id,
            TH: marks.map(mark => mark.th)[index],
            PR: marks.map(mark => mark.pr)[index],
            created_at: new Date().toISOString()
        }));

        // Log the markSetupData to check for undefined values
        console.log("Mark Sheets Data:", markSheetsData);

        // Upsert logic
        for (const mark of markSheetsData) {
            const { class:className, student_id, subject_id, exam_id, TH, PR } = mark;

            console.log("Mark Data:", mark);
            
            // Check for undefined values
            if (!className||!student_id || !subject_id || !exam_id || !TH || !PR) {
                console.error('Invalid data found:', mark);
                throw new Error('One or more required fields are undefined.');
            }

            // Check if the record already exists
            const { data: existingData, error: existingError } = await createClient
                .from('marksheets')
                .select('*')
                .eq('class',className)
                .eq('student_id', student_id)
                .eq('subject_id', subject_id)
                .eq('exam_id', exam_id)
                .limit(1)
                .single();

            if (existingError) {
                // Handle the case where no records are found
                if (existingError.code === 'PGRST116') { // No rows found
                    // Proceed to insert a new record
                } else {
                    throw existingError; // Other errors
                }
            }

            if (existingData) {
                // Update existing record
                const { error: updateError } = await createClient
                    .from('marksheets')
                    .update({ TH, PR })
                    .eq('class',className)
                    .eq('student_id', student_id)
                    .eq('subject_id', subject_id)
                    .eq('exam_id', exam_id)// Assuming 'id' is the primary key

                if (updateError) {
                    throw updateError;
                }
            } else {
                // Insert new record
                const { error: insertError } = await createClient
                    .from('marksheets')
                    .insert(mark);

                if (insertError) {
                    throw insertError;
                }
            }
        }
        return res.status(200).json({
            message: "Mark Entered successfully"
        });
        

       }
       catch(error){
        console.error("Error fetching subjects:", error.message);
        return res.status(500).json({ message: "Failed to fetch subjects", error: error.message });
    }

};



module.exports = { 
    getAssignedSubjects,
    createExam, 
    createNotice, 
    getLedgerStatus, 
    setupMarks,
    enterMarks, 
    getMarksData, 
    getSubjectsByClass
};

