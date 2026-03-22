// import { supabase } from "../config/supabase";
// import { UserCredentials } from "../types/auth.types";

// export const signUp = async ({ email, password }: UserCredentials) => {
//   const { data, error } = await supabase.auth.signUp({ email, password });
//   if (error) throw new Error(error.message);
//   return data;
// };

// export const signIn = async ({ email, password }: UserCredentials) => {
//   const { data, error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   });
//   if (error) throw new Error(error.message);
//   return data.session;
// };
