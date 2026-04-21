// @ts-check
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isProdBuild = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isProdBuild && {
    output: "standalone",
    outputFileTracingRoot: path.join(__dirname, "../../"),
  }),
};

export default nextConfig;
