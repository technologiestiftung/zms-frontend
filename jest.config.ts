/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: ["**/tests/**/*.spec.ts"],
	testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/tests/utils/"],
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
