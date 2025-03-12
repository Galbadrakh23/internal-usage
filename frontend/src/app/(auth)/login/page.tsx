"use client";
import { useState, useEffect } from "react";
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
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { apiUrl } from "@/utils/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { UserContext } from "@/context/UserProvider";
import { useContext } from "react";
import BackgroundPaths from "@/components/kokonutui/background-paths";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const fetchUser = userContext?.fetchUser;

  useEffect(() => {
    Cookies.remove("token");
  }, []);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    if (!email || !password) {
      setError("Бүх талбар бөглөх");
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.post(`${apiUrl}/api/login`, {
        email,
        password,
      });
      if (response.status === 200) {
        const { token } = response.data;
        // Ensure the token is stored before fetching the user
        Cookies.set("token", token, { sameSite: "strict" });
        // Fetch the new user's data
        if (fetchUser) {
          await fetchUser();
        }
        // FetchUser is async, ensure the latest user data before showing toast
        setTimeout(() => {
          toast.success("Амжилттай нэвтэрлээ!", {
            description: `Тавтай морилно уу! ${user?.name || ""}`,
          });
          router.push("/dashboard");
        }, 500);
      } else {
        setError(
          response.data.message || "Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу."
        );
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data.message ||
            "Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу."
        );
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <BackgroundPaths />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="rounded-lg shadow-2xl max-w-md w-full"
        >
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="flex items-center gap-4">
              <Image
                priority={false}
                src="/Turelt-Logo.png"
                alt="Company logo"
                className="dark:invert"
                width={100}
                height={100}
              />
              <CardTitle className="text-center text-2xl font-bold">
                Нэвтрэх
              </CardTitle>
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
                    type="email"
                    required
                    placeholder="И-мэйл хаягаа оруулна уу"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Нууц үг</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Нууц үгээ оруулна уу"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2"></div>
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
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} Turelt LLC.
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
