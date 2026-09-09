import express from "express";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(cookieParser());

app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);

app.get('/', (req, res) => {
    res.send("Hello World!");
})

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});