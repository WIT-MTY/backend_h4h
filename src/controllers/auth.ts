import type { Request, Response } from "express";
import * as AuthService from "@/services/auth.js";

export const signUp = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.signUp(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const logIn = async (req: Request, res: Response) => {
  try {
    const session = await AuthService.logIn(req.body);
    res.status(200).json(session);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
