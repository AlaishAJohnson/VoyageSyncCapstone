const { getDefaultConfig } = require('expo/metro-config');
const path = require('path-browserify');

const config = getDefaultConfig(__dirname);
config.resolver.extraNodeModules = {
  path: path,
};

module.exports = config;
