// next.config.js

// scss 설정
const withSass = require('@zeit/next-sass')

const { API } = process.env
module.exports = {
  ...withSass(),
  // distDir: '_next',
  env: {
    API,
  },
  dir: './src',
}
