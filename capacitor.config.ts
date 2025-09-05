import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'my-app',
  webDir: 'dist',
  plugins: {
    LiveUpdates: {
      appId: 'com.example.meugestorcompras',
      channel: 'Production',
      autoUpdateMethod: 'background',
      maxVersions: 2,
    },
  },
};

export default config;