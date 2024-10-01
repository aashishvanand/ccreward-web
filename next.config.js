/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    loader: 'custom',
    loaderFile: './imageLoader.js',
  },
  transpilePackages: ["next-image-export-optimizer"],
  env: {
    nextImageExportOptimizer_imageFolderPath: "public",
    nextImageExportOptimizer_exportFolderPath: "out",
    nextImageExportOptimizer_quality: "75",
    nextImageExportOptimizer_storePicturesInWEBP: "true",
    nextImageExportOptimizer_exportFolderName: "nextImageExportOptimizer",
    nextImageExportOptimizer_generateAndUseBlurImages: "true",
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