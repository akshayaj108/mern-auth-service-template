const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
    '^.+\\.tsx?$': ['ts-jest', {
      isolatedModules: true,
      tsconfig: 'tsconfig.json' // Explicitly tell Jest to use your config
    }],
  },
  verbose:true
};