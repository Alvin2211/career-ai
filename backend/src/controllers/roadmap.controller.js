import { ApiError } from "../utils/ApiError.js";
import axios from "axios";
import { getAuth } from "@clerk/express";

const getRoadmap = async(req,res)=>{
 
    try {
        const {userId} = getAuth(req);    
        if (!userId) throw new ApiError(400, "not authenticated");

        const {query} = req.query;
        if(!query) throw new ApiError(400,"query parameter is required");

        const response =await axios.get(`${process.env.PYTHON_SERVICE_URL}/get_roadmap`,{
            params: { query }
        });

        if(!response.data) throw new ApiError(500,"No data received from course service, please try later :)"); 
        res.status(200).json({
            success: true,
            data: response.data
        });

    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || "Internal server error :(",
        });

    } 

}

export { getRoadmap };