import type React from "react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  backHref?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({
  title,
  backHref = "/dashboard",
  actions,
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-6 ">
        {backHref && (
          <Link
            href={backHref}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          ></Link>
        )}
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-3 mt-4">{actions}</div>}
    </div>
  );
}
