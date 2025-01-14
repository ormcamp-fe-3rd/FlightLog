const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./", // Next.js 애플리케이션 경로
});

/** @type {import('jest').Config} */

const customJestConfig = {
  // Jest에 대한 사용자 정의 설정
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "node",
  testEnvironmentOptions: {
    env: {
      NODE_ENV: "development",
    },
  },

  // TypeScript 파일 변환 설정
  transform: { "^.+\\.(ts|tsx)$": "ts-jest" },

  // 경로 별칭 매핑 (tsconfig.json에서 baseUrl과 paths 참고)
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/$1" },

  // 테스트 파일 패턴
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
};

module.exports = createJestConfig(customJestConfig);
