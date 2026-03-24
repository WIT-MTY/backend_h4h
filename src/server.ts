import express from "express";
import dotenv from "dotenv";
import catalogoRoutes from "./routes/catalogo.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/", catalogoRoutes);
app.use("/", authRoutes);
app.get("/", (req, res) => res.send("API Running"));

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server on ${PORT}`));
}

export default app;
