// app related sab isme hoga and then isse server.js me import krenge and usko listen krwayenge 
import express from 'express';
import dotenv from 'dotenv';
dotenv.config(); 
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app =express();

app.use(cors({
  origin: "http://localhost:5173",  
  credentials: true, 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

// abhi routes banane rehte hai idhar
import resumeRoutes from './routes/resume.route.js'

app.use('/api',resumeRoutes);

import courseRoutes from './routes/course.route.js';

app.use('/api',courseRoutes);

export { app };