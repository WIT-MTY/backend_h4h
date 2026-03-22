import express from "express";
import dotenv from "dotenv";
import catalogoRoutes from "@/routes/catalogo";
import authRoutes from "@/routes/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", catalogoRoutes);
app.use("/api", authRoutes);
app.get("/", (req, res) => res.send("API Running"));

app.listen(PORT, () => console.log(`Server on ${PORT}`));

export default app;
