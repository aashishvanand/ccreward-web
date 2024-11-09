const { withPigment } = require('@pigment-css/nextjs-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    loader: 'custom',
    loaderFile: './imageLoader.js',
  },
  transpilePackages: [
    '@mui/material',
    '@mui/system',
    '@mui/icons-material',
    '@emotion/react',
    '@emotion/styled'
  ],
  experimental: {
    optimizePackageImports: ['@mui/icons-material', '@mui/material']
  },
  compiler: {
    emotion: true,
    removeConsole: {
      exclude: ["error"]
    }
  }
};

const pigmentConfig = {
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
};

module.exports = withPigment(nextConfig, pigmentConfig);