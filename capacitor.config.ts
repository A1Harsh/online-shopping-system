import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jayveermart.app',
  appName: 'JAYVEERMart',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    backgroundColor: '#ffffff',
  },
};

export default config;
