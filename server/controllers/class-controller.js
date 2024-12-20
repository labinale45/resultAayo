const classmodel =require('../models/class-model');

const addClass =  async (req, res) => {
    try {
        const {className,sec,subject,year}=req.body;
        const userData = {
            className,
            sec,
            subject,
            year
        };
       
        const classData = await classmodel.createClass(userData);
        if (!classData || !classData[0]?.id) {
            throw new Error("Failed to create class");
        }

        const subjects = await classmodel.createSubject(userData, classData[0].id);
       
        res.status(200).json({message:"Class created successfully"});
    } catch (error) {
        console.error("Error in addClass:", error);
        res.status(500).json({message:error.message});
    }
};

const getSubjectsByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const { section, year } = req.query;
        console.log(classId,section,year);
        
        if (!classId || !section || !year) {
            return res.status(400).json({ 
                error: "Class, section, and year are required" 
            });
        }

        const subjects = await classmodel.getSubjectsByClass(classId, section, year);
        res.json(subjects);
        console.log(subjects);
    } catch (error) {
        console.error("Error in getSubjectsByClass:", error);
        res.status(500).json({ 
            error: "Failed to fetch subjects",
            details: error.message 
        });
    }
};

const assignTeacher = async (req, res) => {
    try {
        const { subjectId, teacherId, classId, section } = req.body;
        console.log(subjectId,teacherId,classId,section);

        if (!subjectId || !teacherId || !classId || !section) {
            return res.status(400).json({ 
                message: "Subject ID, teacher ID, class ID, and section are required" 
            });
        }

        const result = await classmodel.assignTeacher(
            subjectId, 
            teacherId, 
            classId, 
            section
        );

        console.log( result);

        res.status(200).json({ 
            message: "Teacher assigned successfully", 
            data: result 
        });
    } catch (error) {
        console.error("Error in assignTeacher:", error);
        res.status(500).json({ message: error.message });
    }
};

const getTeachers = async (req, res) => {
    try {
        const teachers = await classmodel.getTeachers();
        res.json(teachers);
    } catch (error) {
        console.error("Error in getTeachers:", error);
        res.status(500).json({ error: "Failed to fetch teachers" });
    }
};

const getClassesByTeacher = async (req, res) => {
    const { teacherId } = req.params;
    
    try {
      const assignedClass = await classmodel.getClassesByTeacher(teacherId);
      res.json(assignedClass);
      console.log("Teacher class :",assignedClass);
  }catch (error) {
      console.error("Error in getClassesByTeacher:", error);
      res.status(500).json({ error: "Failed to fetch classes" });
  }
};

const getTotalStudentsByTeacher = async (teacherId) => {
    const supabase = await connectdb();
    const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('teacher_id', teacherId);

    if (error) throw error;
    return data.length; // Return the total number of students
};

const getAveragePerformanceByTeacher = async (teacherId) => {
    const supabase = await connectdb();
    const { data, error } = await supabase
        .from('marks')
        .select('average')
        .eq('teacher_id', teacherId);

    if (error) throw error;
    const totalAverage = data.reduce((acc, mark) => acc + mark.average, 0);
    return totalAverage / data.length; // Return the average performance
};


module.exports={
    getTotalStudentsByTeacher,
    getAveragePerformanceByTeacher,
    getClassesByTeacher,addClass, getSubjectsByClass, assignTeacher, getTeachers}


