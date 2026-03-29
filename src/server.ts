import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import catalogoRoutes from "./routes/catalogo.js";
import authRoutes from "./routes/auth.js";
import participanteRoutes from "./routes/participante.js";
import perfilParticipanteRoutes from "./routes/perfilParticipante.js";

dotenv.config();

const app = express();

// Normalize allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: [
      ...allowedOrigins,
      "http://localhost:3000",
      "http://192.168.1.14:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", authRoutes);
app.use("/", catalogoRoutes);
app.use("/participantes", participanteRoutes);
app.use("/participantes", perfilParticipanteRoutes);

app.get("/", (req, res) => res.send("API Running"));

if (process.env.NODE_ENV !== "production") {
  app.listen(process.env.PORT, () =>
    console.log(`Server on ${process.env.PORT}`),
  );
}

export default app;
