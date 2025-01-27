"use client";
import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { apiUrl } from "@/utils/utils";
import { toast } from "sonner";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const promise = () =>
      new Promise((resolve) =>
        setTimeout(() => resolve({ name: "Sonner" }), 2000)
      );

    try {
      const response = await axios.post(`${apiUrl}/api/v1/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        const { userName } = response.data;
        console.log("Data", response.data);
        Cookies.set("userName", userName, { expires: 0.1 });
        toast.promise(promise, {
          loading: "Loading...",
          success: () => {
            return ` Login success`;
          },
          error: "Error",
        });
        router.push("/dashboard");
      } else {
        setError(response.data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data.message || "Login failed. Please try again."
        );
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="flex items-center gap-4">
          <Image
            priority={false}
            src="/Turelt-Logo.png"
            alt="Company logo"
            className="dark:invert"
            width={100}
            height={100}
          />
          <CardDescription className="text-center">
            Та өөрийн бүртгэлтэй хаягаар нэвтэрнэ үү.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Бүртгэлтэй и-мэйл</Label>
              <Input
                id="email"
                name="email"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Нууц үг</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <div
                className="text-red-500 text-sm text-center"
                aria-live="polite"
              >
                <p>{error}</p>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Түр хүлээнэ үү..." : "Нэвтрэх"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600"> Turelt LLC 2025 </p>
        </CardFooter>
      </Card>
    </div>
  );
}
