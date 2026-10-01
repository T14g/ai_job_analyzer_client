"use client";

import Button from "@mui/material/Button";
import Link from "next/link";

export function RouteButton({ href, children }: { href: string; children: string }) {
  return (
    <Button component={Link} href={href} size="small">
      {children}
    </Button>
  );
}
