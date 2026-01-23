import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Box } from "@mui/material";

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

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

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
      // Assume Cloudflare Image ID
      return `https://imagedelivery.net/o7c7-WjKE1zaslpSuiAT5w/${imageSrc}/public`;
  };

  const finalSrc = resolveSrc(src);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const mouseXFromCenter = e.clientX - rect.left - w / 2;
    const mouseYFromCenter = e.clientY - rect.top - h / 2;
    x.set(mouseXFromCenter / w);
    y.set(mouseYFromCenter / h);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Box
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        sx={{
            perspective: 1000,
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
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                width: "100%",
                height: "100%",
            }}
            whileHover={{ scale: 1.05 }}
        >
            <Box
                sx={{
                    position: "relative",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                    width: "100%",
                    height: "100%",
                    display: 'flex', // Ensure image fills container
                }}
            >
                {finalSrc && (
                   <img
                       src={finalSrc}
                       alt={alt || "Card Image"}
                       style={{
                           height: '100%',
                           width: '100%',
                           objectFit: 'contain', // Reverting to contain as per user's "working" code
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
                
                {/* Shimmer Overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0.4) 60%, transparent 80%)',
                        zIndex: 20,
                        transform: 'translateX(-100%)',
                        transition: 'transform 0.5s',
                        animation: 'shimmer 3s infinite',
                        pointerEvents: 'none',
                        '@keyframes shimmer': {
                            '0%': { transform: 'translateX(-150%) skewX(-15deg)' },
                            '40%': { transform: 'translateX(150%) skewX(-15deg)' },
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
                        background: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), transparent, rgba(0,0,0,0.1))',
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
