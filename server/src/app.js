import express from "express"
import problemRoutes from "./routes/problemRoutes.js"
import universityRoutes from "./routes/universityRoutes.js";

const app = express();
app.use(express.json())
app.get("/", (req, res) => {
    res.send("hello")
})

app.use("/api/problems", problemRoutes);
app.use("/api/university", universityRoutes);

export default app;
