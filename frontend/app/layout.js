import "./globals.css";

export const metadata = {
  title: "Painel DevOps",
  description: "Next.js consumindo a API Django",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
