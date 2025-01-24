import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold">Сайн байна уу?</h1>
        <Link href="login">
          <Button size="sm" className="mt-4">
            Нэвтрэх
          </Button>
        </Link>
      </div>
    </div>
  );
}
