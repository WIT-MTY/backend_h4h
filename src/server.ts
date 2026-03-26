import express from "express";
import dotenv from "dotenv";
import cors from "cors";  
import catalogoRoutes from "@/routes/catalogo";
import authRoutes from "@/routes/auth";
import participanteRoutes from "@/routes/participante";
import perfilParticipanteRoutes from "@/routes/perfilParticipante";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"];


app.use(cors({
    origin: allowedOrigins
}));


app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://192.168.1.14:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api", authRoutes);     
app.use("/api", catalogoRoutes);  
app.use("/api/participantes", participanteRoutes);
app.use("/api/participantes", perfilParticipanteRoutes);

app.get("/", (req, res) => res.send("API Running"));

app.listen(PORT, () => console.log(`Server on ${PORT}`));


export default app;
