const { withPigment } = require('@pigment-css/nextjs-plugin');

/** @type {import('next').NextConfig} */
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
  serverExternalPackages: ['sharp'],
  bundlePagesRouterDependencies: true,
  typescript: {
    // You can enable this if you want to use next.config.ts
    // ignoreBuildErrors: false,
  }
};

module.exports = withPigment(nextConfig, {
  theme: {
    spacing: (value) => `${value * 8}px`,
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: {
      borderRadius: '8px',
    }
  }
});