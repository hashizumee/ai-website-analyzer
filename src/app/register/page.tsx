"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/app/actions";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await register(formData);
    
    if (res.error) {
      setError(res.error);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#111827] border-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center">
            <UserPlus className="w-6 h-6 mr-2 text-teal-400" />
            Daftar Akun Baru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div>
              <label className="text-sm font-medium text-slate-300">Nama</label>
              <Input name="name" type="text" required className="bg-slate-900 border-slate-700 text-white" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Email</label>
              <Input name="email" type="email" required className="bg-slate-900 border-slate-700 text-white" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Password</label>
              <Input name="password" type="password" required className="bg-slate-900 border-slate-700 text-white" />
            </div>
            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-500 text-white">
              Daftar
            </Button>
            <p className="text-sm text-slate-400 text-center mt-4">
              Sudah punya akun? <Link href="/login" className="text-teal-400 hover:underline">Masuk</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
