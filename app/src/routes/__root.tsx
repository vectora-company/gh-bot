import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { MotionConfig } from "motion/react";
import { useState } from "react";
import "../styles.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        name: "description",
        content:
          "Configure seu Vectora GH Bot: conecte repositórios GitHub, provedores de IA e políticas de automação na sua própria instalação.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { name: "application-name", content: "Vectora GH Bot" },
      { name: "theme-color", content: "#101317" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: "Vectora GH Bot" },
      { property: "og:title", content: "Vectora GH Bot" },
      {
        property: "og:description",
        content:
          "Automação agêntica para GitHub, configurada e executada na sua própria instalação.",
      },
      {
        property: "og:image",
        content:
          "https://raw.githubusercontent.com/vectora-ltda/gh-bot/main/app/public/gh-bot.png",
      },
      { property: "og:image:alt", content: "Ícone do Vectora GH Bot" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "512" },
      { property: "og:image:height", content: "512" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Vectora GH Bot" },
      {
        name: "twitter:description",
        content:
          "Automação agêntica para GitHub na sua própria instalação.",
      },
      {
        name: "twitter:image",
        content:
          "https://raw.githubusercontent.com/vectora-ltda/gh-bot/main/app/public/gh-bot.png",
      },
      { name: "twitter:image:alt", content: "Ícone do Vectora GH Bot" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/gh-bot.svg" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "shortcut icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
    ],
    title: "Vectora GH Bot",
  }),
  component: RootDocument,
});

function RootDocument() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        <MotionConfig reducedMotion="user">
          <QueryClientProvider client={queryClient}>
            <Outlet />
          </QueryClientProvider>
        </MotionConfig>
        <Scripts />
      </body>
    </html>
  );
}
