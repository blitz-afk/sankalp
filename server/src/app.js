import express from "express"
import problemRoutes from "./routes/problemRoutes.js"

const app = express();
app.use(express.json())
app.get("/", (req, res) => {
    res.send("hello")
})

app.use("/api/problems", problemRoutes);

export default app;
