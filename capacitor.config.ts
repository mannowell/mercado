import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.meugestorcompras',
  appName: 'my-app',
  webDir: 'dist',
  plugins: {
    LiveUpdates: {
      appId: '2b5a0b10',
      channel: 'Production',
      autoUpdateMethod: 'background',
      maxVersions: 2,
    },
  },
};

export default config;