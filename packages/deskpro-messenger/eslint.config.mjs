import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,jsx}"]},
  {languageOptions:
    { globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    settings: {
      react: {
        version: "detect"
      }
    }
  },
  {ignores: ["**/__tests__/**", "src/setupTests.js", "**/Fake*.js"] },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  { rules: {
    "no-unused-vars": "off",
    "react/prop-types": "off",
    "react/display-name": "off",
    "no-prototype-builtins": "off",
  }
},
];