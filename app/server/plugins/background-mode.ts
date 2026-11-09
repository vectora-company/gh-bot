import { definePlugin } from "nitro";

export default definePlugin((nitroApp) => {
  if (!nitroApp.h3) throw new Error("Nitro H3 app is unavailable.");

  nitroApp.h3["~middleware"].unshift((event, next) => {
    if (process.env.VECTORA_GH_BOT_MODE !== "background") return next();

    const { pathname } = event.url;
    const isOperationalRoute =
      pathname === "/healthz" ||
      pathname === "/api/openapi.json" ||
      pathname.startsWith("/api/");

    if (!isOperationalRoute) {
      return new Response("Dashboard disabled in background mode.", {
        status: 404,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }
    return next();
  });
});
