import "dotenv/config";
import express from 'express';
import authRoute from './Routes/authRoutes.js';
import { connectDB } from './lib/db.js';
import bookRoute from './Routes/bookRoutes.js';
import cors from 'cors';
const app = express();
const PORT = 8000;


app.use(express.json({ limit: "10mb" }))
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use('/api/auth', authRoute)
app.use('/api/books', bookRoute)


app.listen(PORT, () => {
    console.log(`server is running on port http://localhost:${PORT}`);
    connectDB()
        .then(() => console.log("MongoDB connected successfully"))
})