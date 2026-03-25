
import express from "express";
import dotenv from "dotenv";
import cors from "cors";  
import catalogoRoutes from "@/routes/catalogo";
import authRoutes from "@/routes/auth";
import participanteRoutes from "@/routes/participante";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://192.168.1.14:3000" 
  ]
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api", authRoutes);     
app.use("/api", catalogoRoutes);  

app.get("/", (req, res) => res.send("API Running"));

app.listen(PORT, () => console.log(`Server on ${PORT}`));

app.use("/api", participanteRoutes);

export default app;
