import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import catalogoRoutes from "./routes/catalogo.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:3000",
];

app.use(
  cors({
    origin: allowedOrigins,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", catalogoRoutes);
app.use("/", authRoutes);

app.get("/", (req, res) => res.send("API Running"));

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server on ${PORT}`));
}

export default app;
