import createClient from "openapi-fetch";
import type { paths } from "@/types/api";

export default function createApi(access_token: string) {
  return createClient<paths>({
    baseUrl: "http://localhost:8080/api/v1",
    headers: {
      origin: "http://localhost:3000",
      Authorization: `Bearer ${access_token}`,
    },
  });
}
