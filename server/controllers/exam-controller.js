const connectdb = require('../utils/connectdb');
const dotenv = require('dotenv');

dotenv.config();

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

module.exports = {createExam};