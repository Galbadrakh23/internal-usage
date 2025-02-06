"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { GlobeIcon, Loader2 } from "lucide-react";
import BackgroundPaths from "@/components/kokonutui/background-paths";
import { ReportContext } from "@/context/ReportProvider";

export default function Page() {
  const { loading } = useContext(ReportContext);

  useEffect(() => {
    Cookies.remove("token");
  }, []);

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

            {loading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-600 dark:text-blue-400" />
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Уншиж байна...
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  Сайн байна уу
                </h2>
                <Link href="login" className="w-full">
                  <Button
                    size="lg"
                    className="w-full bg-gray-600 hover:bg-gray-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                  >
                    Нэвтрэх
                  </Button>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
