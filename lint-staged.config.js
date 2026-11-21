export default {
  "*": "oxfmt --write --no-error-on-unmatched-pattern",
  "*.{js,mjs,cjs,ts,mts,cts,tsx,jsx,vue}": "oxlint --type-aware --deny-warnings --fix",
};
