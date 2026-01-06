// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Get the project root (frontend directory)
const projectRoot = __dirname;

// Exclude backend directory and all parent-level backend files from bundling
config.resolver.blockList = [
  // Block backend directory - match any path containing 'backend'
  /.*[\\\/]backend[\\\/].*/,
  /backend[\\\/].*/,
  /\.\.\/backend\/.*/,
  /\.\.\/\.\.\/backend\/.*/,
  // Block any server.js files outside frontend/src
  /\.\.\/.*[\\\/]server\.js$/,
  /.*[\\\/]backend[\\\/].*[\\\/]server\.js$/,
  // Block the specific problematic file
  /.*[\\\/]backend[\\\/]src[\\\/]server\.js$/,
];

// Only watch the frontend directory - prevent Metro from scanning parent directories
config.watchFolders = [projectRoot];
config.projectRoot = projectRoot;

// Custom resolver to explicitly block backend files
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Normalize the path to handle both forward and backslashes
  const normalizedModule = moduleName.replace(/\\/g, '/');
  
  // Block any request that includes 'backend' in the path
  if (normalizedModule.includes('backend') || 
      normalizedModule.includes('server.js') ||
      normalizedModule.match(/\.\.\/.*backend/) ||
      context.originModulePath?.includes('backend')) {
    throw new Error(
      `Cannot resolve module: ${moduleName}. ` +
      `Backend files are not allowed in React Native bundle. ` +
      `Origin: ${context.originModulePath || 'unknown'}`
    );
  }
  
  // Use default resolver for everything else
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
