const classmodel =require('../models/class-model');

const addClass =  async (req, res) => {
    try {
        const {className,sec,subject}=req.body;
        const userData = {
            className,
            sec,
            subject
        };
       
        const classes = await classmodel.createClass(userData);
        
        const subjects =await classmodel.createSubject(userData);
       
        res.status(200).json({message:"Class created successfully"});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};

module.exports={addClass}