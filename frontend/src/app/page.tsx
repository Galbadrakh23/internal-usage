"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { GlobeIcon } from "lucide-react";
import BackgroundPaths from "@/components/kokonutui/background-paths";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    Cookies.remove("token");
    router.push("/login"); // Redirect to the login page
  }, [router]);

  return (
    <div className="min-h-screen relative">
      <BackgroundPaths title="" />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white dark:bg-neutral-900 rounded-lg shadow-2xl p-8 max-w-md w-full"
        >
          <div className="flex flex-col items-center gap-6 text-center">
            <GlobeIcon className="w-16 h-16 text-gray-600 dark:text-blue-400" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
