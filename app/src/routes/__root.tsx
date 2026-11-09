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
        content: "Configure sua instalação self-hosted do Vectora GH Bot.",
      },
      { name: "theme-color", content: "#101317" },
    ],
    links: [{ rel: "icon", href: "data:," }],
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
