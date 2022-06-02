module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-typescript",
  ],
  plugins: [
    [
      "module-resolver",
      {
        alias: {
          "@config": "./src/config",
          "@modules": "./src/modules",
          "@shared": "./src/shared",
          "@utils": "./src/utils",
          swaggerFile: "./src/swagger.json",
        },
      },
    ],
    "babel-plugin-transform-typescript-metadata",
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
  ],
  ignore: ["**/*.spec.ts", "**/*.d.ts"],
};
