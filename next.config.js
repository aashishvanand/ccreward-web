const nextConfig = {
  output: "export",
  images: {
    loader: 'custom',
    loaderFile: './imageLoader.js',
  },
  eslint: {
    // Warnings are treated as warnings, not errors during build
    ignoreDuringBuilds: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error"],
    } : false,
  },
  trailingSlash: false,
  serverExternalPackages: ['sharp'], // Previously serverComponentsExternalPackages
  bundlePagesRouterDependencies: true, // Previously bundlePagesExternals
  typescript: {
    // You can enable this if you want to use next.config.ts
    // ignoreBuildErrors: false,
  }
};

module.exports = nextConfig;