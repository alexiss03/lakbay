import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.lakbay.mobile",
  appName: "Lakbay",
  webDir: "dist/public",
  server: {
    androidScheme: "https",
  },
};

export default config;
