/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    loader: 'custom',
    loaderFile: './imageLoader.js',
  },
  experimental: {
    forceSwcTransforms: true,
  },
  // compiler:{
  //   removeConsole:{
  //     exclude:["error"]
  //   }
  // }
};

module.exports = nextConfig;