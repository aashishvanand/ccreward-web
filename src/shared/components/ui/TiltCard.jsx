"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Box, useMediaQuery } from "@mui/material";
import { buildCloudflareImageUrl } from "@/core/utils/cloudflareImages";

const TiltCard = ({ 
  src, 
  alt, 
  orientation = "horizontal",
  width,
  height,
  children,
  ...props 
}) => { 
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smoother spring: higher damping (22 vs 15) reduces oscillation
  const mouseX = useSpring(x, { stiffness: 150, damping: 22 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 22 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

  // Standard aspect ratio ~ 1.586
  const aspectRatio = 1.586;
  
  // Calculate aspect ratio string for CSS
  const cssAspectRatio = orientation === 'vertical' ? `${1/aspectRatio}` : `${aspectRatio}`;

  // Helper to resolve image source
  const resolveSrc = (imageSrc) => {
      if (!imageSrc) return '';
      if (imageSrc.startsWith('http') || imageSrc.startsWith('/')) return imageSrc;
      return buildCloudflareImageUrl(imageSrc, "public");
  };

  const finalSrc = resolveSrc(src);

  const handleMouseMove = (e) => {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const mouseXFromCenter = e.clientX - rect.left - w / 2;
    const mouseYFromCenter = e.clientY - rect.top - h / 2;
    x.set(mouseXFromCenter / w);
    y.set(mouseYFromCenter / h);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <Box
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
            perspective: prefersReducedMotion ? 'none' : 1000,
            display: "inline-block",
            cursor: "pointer",
            width: width || 'auto',
            height: height || 'auto',
            aspectRatio: width && !height ? cssAspectRatio : undefined,
            ...props.sx
        }}
    >
        <motion.div
            style={{
                rotateX: prefersReducedMotion ? 0 : rotateX,
                rotateY: prefersReducedMotion ? 0 : rotateY,
                transformStyle: "preserve-3d",
                width: "100%",
                height: "100%",
            }}
            whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <Box
                sx={{
                    position: "relative",
                    borderRadius: "16px",
                    overflow: "hidden",
                    // Lighter default shadow; deepens on hover
                    boxShadow: isHovered
                        ? "0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 12px 24px -8px rgba(0, 0, 0, 0.2)"
                        : "0 10px 30px -8px rgba(0, 0, 0, 0.3)",
                    transition: "box-shadow 0.3s ease",
                    width: "100%",
                    height: "100%",
                    display: 'flex',
                }}
            >
                {finalSrc && (
                   <img
                       src={finalSrc}
                       alt={alt || "Card Image"}
                       style={{
                           height: '100%',
                           width: '100%',
                           objectFit: 'contain',
                           borderRadius: "16px",
                           position: 'relative',
                           zIndex: 10
                       }}
                   />
                )}
                
                {children && (
                  <Box sx={{ position: 'relative', zIndex: 11, height: '100%', width: '100%' }}>
                    {children}
                  </Box>
                )}
                
                {/* Shimmer Overlay - only animates on hover */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.18) 45%, rgba(255,255,255,0.18) 55%, transparent 70%)',
                        zIndex: 20,
                        transform: isHovered ? undefined : 'translateX(-150%) skewX(-15deg)',
                        animation: isHovered && !prefersReducedMotion
                            ? 'shimmer 1.8s ease-in-out'
                            : 'none',
                        pointerEvents: 'none',
                        '@keyframes shimmer': {
                            '0%': { transform: 'translateX(-150%) skewX(-15deg)' },
                            '100%': { transform: 'translateX(150%) skewX(-15deg)' },
                        }
                    }}
                />

                {/* Glossy reflection gradient */}
                 <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to bottom right, rgba(255,255,255,0.15), transparent, rgba(0,0,0,0.08))',
                        zIndex: 20,
                        borderRadius: "16px",
                         pointerEvents: 'none',
                    }}
                 />

            </Box>
        </motion.div>
    </Box>
  );
};

export default TiltCard;
