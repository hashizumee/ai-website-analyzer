"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function register(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password) return { error: "Email dan password wajib diisi." };

  const data = db.read();
  if (data.users.find(u => u.email === email)) {
    return { error: "Email sudah terdaftar." };
  }

  const id = crypto.randomUUID();
  data.users.push({ id, email, password, name });
  db.write(data);

  return { success: true };
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const data = db.read();
  const user = data.users.find(u => u.email === email && u.password === password);

  if (!user) {
    return { error: "Email atau password salah." };
  }

  // Create simple session via cookie
  const cookieStore = await cookies();
  cookieStore.set("session_user_id", user.id, { httpOnly: true, secure: true, maxAge: 60 * 60 * 24 * 7 });

  return { success: true };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session_user_id");
}

export async function getUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("session_user_id")?.value;
  if (!userId) return null;

  const data = db.read();
  return data.users.find(u => u.id === userId) || null;
}
