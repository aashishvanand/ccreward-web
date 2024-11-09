const nextConfig = {
  output: "export",
  images: {
    loader: 'custom',
    loaderFile: './imageLoader.js',
  },
  compiler:{
    removeConsole:{
      exclude:["error"]
    }
  },
  serverExternalPackages: ['sharp'], // Previously serverComponentsExternalPackages
  bundlePagesRouterDependencies: true, // Previously bundlePagesExternals
  typescript: {
    // You can enable this if you want to use next.config.ts
    // ignoreBuildErrors: false,
  }
};

module.exports = nextConfig;