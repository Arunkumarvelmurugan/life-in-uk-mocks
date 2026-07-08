import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { Fragment } from "react";

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
      <Link href="/" className="flex items-center hover:text-foreground">
        <Home size={15} />
      </Link>
      {items.map((item, i) => (
        <Fragment key={item.label}>
          <ChevronRight size={14} />
          {item.href && i !== items.length - 1 ? (
            <Link href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
