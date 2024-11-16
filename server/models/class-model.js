const connectdb = require('../utils/connectdb');	
const dotenv = require('dotenv');

dotenv.config();


const createClass = async (userData) => {
    try {
        if (!userData.className || !userData.sec) {
            throw new Error("Incomplete class data");
        }
        const createClient = await connectdb();
        
        const { data: classData, error: classError } = await createClient
            .from('class')
            .insert({
                class: userData.className,
                sec: userData.sec,
            })
            .select();

        if (classError) throw classError;
        return classData;
    } catch (error) {
        console.error("Error creating class:", error);
        throw error;
    }
}

const getClass = async ()=>{
    try {
        const createClient = await connectdb();
        const {data,error} = await createClient
        .from('class')
        .select('*');
        if(error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching class:", error);
    }
}

const createSubject = async (userData, classId) => {
    try {
        if(!userData.subject){
            throw new Error("Incomplete class data");
        }

        const createClient = await connectdb();
        const subjectPromises = userData.subject.map(subject => 
            createClient
                .from('subjects')
                .insert({ 
                    subject_name: subject,
                    class_id: classId 
                })
        );

        const results = await Promise.all(subjectPromises);
        
        // Check for any errors in the results
        const errors = results.filter(result => result.error);
        if (errors.length > 0) {
            throw new Error(`Error creating subjects: ${errors[0].error.message}`);
        }

        return results.map(result => result.data);
    }
    catch (error) {
        console.error("Error creating subject:", error);
        throw error;
    }
}

const getSubjects = async ()=>{
    try {
        const createClient = await connectdb();
        const {data,error} = await createClient
        .from('subjects')
        .select('*');
        if(error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching subjects:", error);
    }
}

const getSubjectsByClass = async (classId, section, year) => {
    try {
        const createClient = await connectdb();
        
        // First get the class ID from the class table
        const { data: classData, error: classError } = await createClient
            .from('class')
            .select('id')
            .eq('class', classId)
            .eq('sec', section)
            .single();

        if (classError) throw classError;
        if (!classData) throw new Error('Class not found');

        // Then get the subjects with teacher information
        const { data: subjectsData, error: subjectsError } = await createClient
            .from('subjects')
            .select(`
                id,
                subject_name,
                teacher:teachers(
                    id,
                    first_name,
                    last_name
                )
            `)
            .eq('class_id', classData.id);

        if (subjectsError) throw subjectsError;
        
        return subjectsData.map(item => ({
            id: item.id,
            name: item.subject_name,
            teacher: item.teacher ? `${item.teacher.first_name} ${item.teacher.last_name}` : ""
        }));
    } catch (error) {
        console.error("Error fetching subjects:", error);
        throw error;
    }
};

const assignTeacher = async (subjectId, teacherId, classId, section) => {
    try {
        const createClient = await connectdb();
        const { data, error } = await createClient
            .from('subjects')
            .update({ teacher_id: teacherId })
            .eq('id', subjectId)
            .eq('class_id', classId)
            .eq('section', section)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error assigning teacher:", error);
        throw error;
    }
};

module.exports ={createClass, getClass, createSubject, getSubjects, getSubjectsByClass, assignTeacher};