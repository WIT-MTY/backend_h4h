
import express from "express";
import dotenv from "dotenv";
import cors from "cors";  
import catalogoRoutes from "@/routes/catalogo";
import authRoutes from "@/routes/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: [
        'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api", catalogoRoutes);  
app.use("/api", authRoutes); 

app.get("/", (req, res) => res.send("API Running"));

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server on ${PORT}`));
}


export default app;