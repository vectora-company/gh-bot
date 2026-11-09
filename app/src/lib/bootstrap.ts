import { createServerFn } from "@tanstack/react-start";
import { getBootstrapStatus as readBootstrapStatus } from "../server/bootstrap";

export const getBootstrapStatus = createServerFn({ method: "GET" }).handler(
  () => readBootstrapStatus(),
);
