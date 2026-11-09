import { createFileRoute } from "@tanstack/react-router";
import { App } from "../components/dashboard";

export const Route = createFileRoute("/")({ component: App });
