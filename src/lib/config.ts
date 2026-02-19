// Environment configuration utilities

export const getOpenClawConfig = () => {
  return process.env.OPENCLAW_CONFIG || '/root/.openclaw/openclaw.json';
};

export const getOpenClawWorkspace = () => {
  return process.env.OPENCLAW_WORKSPACE || '/root/.openclaw/workspace';
};

export const getDataDir = () => {
  return process.env.DATA_DIR || './data';
};

export const getAppConfig = () => {
  return {
    openClawConfig: getOpenClawConfig(),
    openClawWorkspace: getOpenClawWorkspace(),
    dataDir: getDataDir(),
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development',
  };
};