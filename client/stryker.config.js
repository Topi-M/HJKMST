export default {
  testRunner: "vitest",
  mutate: ["src/components/*.{js,jsx}"], // the source files to mutate
  reporters: ["html", "clear-text", "progress"],
  coverageAnalysis: "perTest",
  vitest: {
    configFile: "vitest.config.js",
    related: false  // disable related test filtering until it's stable
  }
};