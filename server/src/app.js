import express from "express"
import problemRoutes from "./routes/problemRoutes.js"
import universityRoutes from "./routes/universityRoutes.js";
import solutionRoutes from "./routes/solutionRoutes.js";
import industryRoutes from "./routes/industryRoutes.js";
import industryInterestRoutes from "./routes/industryInterestRoutes.js";

const app = express();
app.use(express.json())
app.get("/", (req, res) => {
    res.send("hello")
})

app.use("/api/problems", problemRoutes);
app.use("/api/university", universityRoutes);
app.use("/api/solutions", solutionRoutes);
app.use("/api/industry", industryRoutes);
app.use("/api/industry-interests", industryInterestRoutes);
export default app;
