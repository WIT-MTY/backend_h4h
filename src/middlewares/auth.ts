// import { Request, Response, NextFunction } from "express";
// import { supabase } from "../config/supabase";

// export const protectRoute = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) return res.status(401).json({ message: "No token provided" });

//   const {
//     data: { user },
//     error,
//   } = await supabase.auth.getUser(token);

//   if (error || !user) return res.status(401).json({ message: "Invalid token" });

//   // Guardamos al usuario en el objeto request para usarlo en el controller
//   (req as any).user = user;
//   next();
// };
