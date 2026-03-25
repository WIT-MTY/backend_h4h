import type { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase.js";

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) return res.status(401).json({ message: "Invalid token" });

  // Se guarda usuario en el objeto request para usarlo en el controller
  (req as any).user = user;
  next();
};

export const canDeleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.body;
  const requester = req.user;

  // Safety check: Ensure protectRoute was called first
  if (!requester) {
    return res.status(401).json({ error: "No autenticado" });
  }

  // Safety check: Ensure a userId was actually provided in the body
  if (!userId) {
    return res
      .status(400)
      .json({ error: "Falta el ID del usuario a eliminar" });
  }

  try {
    // 1. Ownership check
    if (requester.id === userId) {
      return next();
    }

    // 2. Admin check
    const { data: admin, error } = await supabase
      .from("admins")
      .select("id")
      .eq("id", requester.id)
      .maybeSingle(); // .maybeSingle() is safer than .single() as it won't throw an error if not found

    if (admin) {
      return next();
    }

    return res.status(403).json({ error: "No tienes permisos suficientes" });
  } catch (err) {
    console.error("Auth Error:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
