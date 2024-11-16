const classmodel =require('../models/class-model');

const addClass =  async (req, res) => {
    try {
        const {className,sec,subject}=req.body;
        const userData = {
            className,
            sec,
            subject
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
        
        if (!classId || !section || !year) {
            return res.status(400).json({ 
                error: "Class, section, and year are required" 
            });
        }

        const subjects = await classmodel.getSubjectsByClass(classId, section, year);
        res.json(subjects);
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

        res.status(200).json({ 
            message: "Teacher assigned successfully", 
            data: result 
        });
    } catch (error) {
        console.error("Error in assignTeacher:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports={addClass, getSubjectsByClass, assignTeacher}