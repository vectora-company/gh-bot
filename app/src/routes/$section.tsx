import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "../components/section-page";

export const Route = createFileRoute("/$section")({ component: SectionPage });
