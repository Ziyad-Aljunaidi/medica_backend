module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    ecmaVersion: 8
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    quotes: ["error", "double"],
  },
};
