import React from 'react';

const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Add alias for react-native-web-webview
  config.resolve.alias['react-native-web-webview'] = require.resolve('react-native-webview');
  return config;
};
    
  
   