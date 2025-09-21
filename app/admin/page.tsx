"use client"
import { useAuth } from "@/src/hooks/useAuth";
import LoginPage from "./auth/login/page";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { isAuthenticated, isLoading } = useAuth();
  console.log("IS AUTH", isAuthenticated)
  const router = useRouter();

   useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <main className="min-h-screen">
      <LoginPage />
    </main>
  );
}
