import express from 'express'
import cors from 'cors'
import errorMiddleware from "./middleware/error.middleware.js";
import notebookRoutes from "./routes/notebook.routes.js";
import sourceRoutes from "./routes/source.routes.js";
import chatRoutes from "./routes/chat.routes.js"
import {serve} from 'inngest/express'
import { inngest,functions } from './inngest/index.js';
import {clerkMiddleware} from "@clerk/express"


const app=express()

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware());
app.use(express.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
    res.status(200).json({
    success: true,
    message: "NotebookLM API Running",
  });
})

app.use("/api/inngest",serve({client: inngest,functions,}));

app.use("/api/notebooks", notebookRoutes);
app.use("/api/sources", sourceRoutes);
app.use("/api/chat", chatRoutes);


app.use(errorMiddleware);



export default app