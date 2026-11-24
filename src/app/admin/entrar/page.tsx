import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogoImage } from "@/components/brand";
import { LoginForm } from "@/components/admin/login-form";
import { isAdmin } from "@/lib/server/admin-auth";

export const metadata: Metadata = { title: "Entrar" };

/** Entrada al panel: solo contraseña (una sola usuaria). Con sesión válida se salta directo al panel. */
export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-12">
      <LogoImage className="mx-auto h-auto w-40" sizes="160px" priority />
      <h1 className="mt-8 text-center font-display text-3xl">Panel de la tienda</h1>
      <p className="mt-2 text-center text-muted">Aquí agregas, editas y marcas como vendidas tus prendas.</p>
      <LoginForm />
    </main>
  );
}
