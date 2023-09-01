import express from 'express';
import {readdirSync} from 'fs';
import csrf from "csurf";
import cors from 'cors';
import cookieParser from 'cookie-parser'; 
import mongoose from 'mongoose';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

const csrfProtection = csrf({ cookie: true });
//middlewares
const app = express();
//db
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
}).then(() => console.log('DB Connected'))
.catch((err) => console.log('DB Connection Error: ', err));

app.use(cors());
app.use(express.json({limit: '5mb'}));
app.use(morgan('dev'));
app.use(cookieParser());
app.use((req, res, next) => {
    console.log('This is my own middleware');
    next();
});

//routes
readdirSync('./routes').map((r) =>
{
    app.use('/api', require(`./routes/${r}`));
});
app.use(csrfProtection);
app.get('/api/csrf-token',(req,res)=>
{
    res.json({csrfToken:req.csrfToken()});
}); 

//port
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});