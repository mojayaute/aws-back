module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>'], // 🔁 buscar desde la raíz del proyecto
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
