import { defineConfig } from "prisma/config";

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL ?? "'postgresql://neondb_owner:npg_Uj6uwQ1dhtNP@ep-noisy-tooth-abw10q8z-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=r",
  },
});

