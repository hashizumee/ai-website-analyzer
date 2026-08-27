"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/actions";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await login(formData);
    
    if (res.error) {
      setError(res.error);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#111827] border-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center">
            <LogIn className="w-6 h-6 mr-2 text-teal-400" />
            Masuk (Login)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div>
              <label className="text-sm font-medium text-slate-300">Email</label>
              <Input name="email" type="email" required className="bg-slate-900 border-slate-700 text-white" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Password</label>
              <Input name="password" type="password" required className="bg-slate-900 border-slate-700 text-white" />
            </div>
            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-500 text-white">
              Masuk
            </Button>
            <p className="text-sm text-slate-400 text-center mt-4">
              Belum punya akun? <Link href="/register" className="text-teal-400 hover:underline">Daftar</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
