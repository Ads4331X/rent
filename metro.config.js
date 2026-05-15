const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Suppress CSS warnings
config.transformer.minifierConfig = {
  keep_classnames: true,
  keep_fnames: true,
  mangle: { keep_classnames: true, keep_fnames: true },
};

module.exports = withNativeWind(config, { input: "./global.css" });
