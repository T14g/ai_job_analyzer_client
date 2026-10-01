import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { ThemeRegistry } from "@/theme/ThemeRegistry";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "AI Job Analyzer",
  description: "Busca vagas da Gupy, avalia títulos com IA e mostra tendências.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={roboto.variable}>
      <body>
        <ThemeRegistry>
          <AppShell>{children}</AppShell>
        </ThemeRegistry>
      </body>
    </html>
  );
}
