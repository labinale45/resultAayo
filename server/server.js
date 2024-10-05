const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDb = require('./utils/connectdb');
const authRouter = require('./routes/auth-rout');
const authMiddleware = require('./middlewares/authmiddleware');
const {dashboard} = require('./controllers/dashboard');

// Increase payload size limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());
app.use(bodyParser.json()); 
app.use(express.json());
app.use('/api/auth',authRouter);
app.use('/api/dashboard',(req,res, next)=>{ dashboard(req,res, next)});
app.use('/admin',authMiddleware);
connectDb().then(()=>{
    app.listen(4000,()=>{
        console.log("Server is running on port 4000");
    });
}).catch((error)=>{
    console.log(error.message);
});
