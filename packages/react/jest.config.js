/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transformIgnorePatterns: ["/node_modules/(?!node-fetch/.*)"],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest",
  },
  setupFilesAfterEnv: ["./jest.setup.ts"],
};

// "type": "module",
