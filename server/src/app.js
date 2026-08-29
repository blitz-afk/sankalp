import express from "express"
import problemRoutes from "./routes/problemRoutes.js"
import universityRoutes from "./routes/universityRoutes.js";
import solutionRoutes from "./routes/solutionRoutes.js";
import industryRoutes from "./routes/industryRoutes.js";
import industryInterestRoutes from "./routes/industryInterestRoutes.js";
import governmentBodyRoutes from "./routes/governmentBodyRoutes.js";
import pilotRequestRoutes from "./routes/pilotRequestRoutes.js";
import governmentProblemRoutes from "./routes/governmentProblemRoutes.js";
import governmentOfficerRoutes from "./routes/governmentOfficerRoutes.js";
import pilotRoutes from "./routes/pilotRoutes.js";
import pilotEvaluationRoutes from "./routes/pilotEvaluationRoutes.js";
import pilotVerificationRoutes from "./routes/pilotVerificationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import problemAnalysisRoutes from "./routes/problemAnalysisRoutes.js";
import cors from "cors";

const app = express();
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);
app.use(express.json())
app.get("/", (req, res) => {
    res.send("hello")
})

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/university", universityRoutes);
app.use("/api/solutions", solutionRoutes);
app.use("/api/industry", industryRoutes);
app.use("/api/industry-interests", industryInterestRoutes);
app.use("/api/government-bodies", governmentBodyRoutes);
app.use("/api/pilot-requests", pilotRequestRoutes);
app.use("/api/government/problems", governmentProblemRoutes);
app.use("/api/government-officers", governmentOfficerRoutes);
app.use("/api/pilots", pilotRoutes);
app.use("/api/pilot-evaluations", pilotEvaluationRoutes);
app.use("/api/pilot-verifications", pilotVerificationRoutes);
app.use("/api/problems/analyze",problemAnalysisRoutes);


export default app;
