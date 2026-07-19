import express from "express";
import { router as authRouter } from "./routes/authRoutes.js";
const app = express();

app.use('/', (req, res) => {
    res.json("Server started on ts file ");
})

app.use('/auth', authRouter)

app.listen(5000, () => {
    console.log("Server started on port 5000");
})

