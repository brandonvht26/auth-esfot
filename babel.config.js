module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
        ["module-resolver", { root: ["./src"], alias: { "@": "./src" } }],
        [
            "@tamagui/babel-plugin",
            {
                config: "./tamagui.config.ts",
                components: ["tamagui"],
            },
        ],
    ],
  };
};