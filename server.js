import express from "express";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);

app.get('/', (req, res) => {
    res.send("Hello World!");
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})