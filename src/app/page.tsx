"use client";

import ThemeProvider from "@/contexts/theme";
import ViewProvider from "@/contexts/view";
import EntityProvider from "@/contexts/entity";

import Layout from "@/components/layouts/layout/layout";

import "@/assets/styles/main.scss";

export default function Page() {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <ViewProvider>
            <EntityProvider>
              <Layout />
            </EntityProvider>
          </ViewProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
