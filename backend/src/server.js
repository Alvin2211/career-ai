//isme db connect krke  then app import krke  listen krenge
import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from "./db/index.js";
import { app } from "./app.js";

connectDB()
.then(() => {
    app.on('error',(error)=>{
        console.log('Error on starting server: ',error);
    })

    app.listen(process.env.PORT,()=>{
        console.log(`App is listening on Port ${process.env.PORT}`)
    });

})

.catch((error)=>{
    console.log("Error in DB connection:",error);
    process.exit(1);
});

