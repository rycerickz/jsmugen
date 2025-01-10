"use client";

import ThemeProvider from "@/contexts/theme";

import Layout from "@/components/layouts/layout/layout";

import "@/assets/styles/main.scss";

export default function Page() {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Layout/>
        </ThemeProvider>
      </body>
    </html>
  );
}
