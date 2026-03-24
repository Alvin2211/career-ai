import { ApiError } from "../utils/ApiError.js";
import axios from "axios";

const getcourses= async (req,res) => {
    try {
        const userId = req.auth?.userId;    
        if (!userId) throw new ApiError(400, "mot authenticated");

        const {query} = req.query;
        if(!query) throw new ApiError(400,"query parameter is required");

        const response =await axios.get(`${process.env.PYTHON_SERVICE_URL}/get_courses`,{
            params: { query }
        });

        if(!response.data) throw new ApiError(500,"No data received from course service, please try later :)"); 

        console.log("RESPONSE FROM PYTHON SERVICE:", response.data);
        res.status(200).json({
            success: true,
            data: response.data
        });

    }catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || "Internal server error :(",
        });

    }  
}

export { getcourses };