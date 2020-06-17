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
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config
    console.log(config)

    // auto open window setting // do now works 😭
    if(config.devServer){
      config.devServer.open = true
    }else{
      config.devServer = {open: true}
    }

    return config
  },

}
