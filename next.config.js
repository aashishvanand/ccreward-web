const { withPigment } = require('@pigment-css/nextjs-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    loader: 'custom',
    loaderFile: './imageLoader.js',
  },
  compiler: {
    removeConsole: {
      exclude: ["error"]
    }
  },
  serverExternalPackages: ['sharp'],
  bundlePagesRouterDependencies: true,
  webpack: (config, { isServer }) => {
    // Ensure single React instance
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'react': require.resolve('react'),
        'react-dom': require.resolve('react-dom'),
        'scheduler': require.resolve('scheduler'),
      };
    }

    // Add proper resolution for modules
    if (!config.resolve) {
      config.resolve = {};
    }

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      dns: false,
    };

    return config;
  }
};

// Apply Pigment CSS configuration
const configWithPigment = withPigment(nextConfig, {
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

module.exports = configWithPigment;