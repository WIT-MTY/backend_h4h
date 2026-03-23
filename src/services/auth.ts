import { supabase } from "@/config/supabase";
import type UserCredentials from "@/types/UserCredentials.js";

export const signUp = async (credentials: UserCredentials) => {
  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
  });
  if (error) throw new Error(error.message);
  return data;
};

export const logIn = async (credentials: UserCredentials) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });
  if (error) throw new Error(error.message);
  return data.session;
};
