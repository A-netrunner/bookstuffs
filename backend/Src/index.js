import express from 'express';
import "dotenv/config";
import authRoute from '../src/Routes/authRoutes.js';
import { connectDB } from './lib/db.js';
import bookRoute from '../src/Routes/bookRoutes.js';
import cors from 'cors';
const app = express();
const PORT = 8000;
import "dotenv/config";



app.use(express.json({ limit: "10mb" }))
app.use(cors())
// app.use(express.urlencoded({extended:true}))
app.use('/api/auth', authRoute)
app.use('/api/books', bookRoute)


app.listen(PORT, () => {
    console.log(`server is running on port http://localhost:${PORT}`);
    connectDB()
        .then(() => console.log("MongoDB connected successfully"))
})