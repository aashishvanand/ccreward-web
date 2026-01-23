import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Box } from "@mui/material";

const TiltCard = ({ src, alt, height = 220 }) => { // Increased default height from 180 to 220
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseXFromCenter = e.clientX - rect.left - width / 2;
    const mouseYFromCenter = e.clientY - rect.top - height / 2;

    const xPct = mouseXFromCenter / width;
    const yPct = mouseYFromCenter / height;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Box
        sx={{
            perspective: 1000,
            display: "inline-block",
            cursor: "pointer"
        }}
    >
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            whileHover={{ scale: 1.05 }}
        >
            <Box
                sx={{
                    position: "relative",
                    borderRadius: "16px", // Squircle-ish
                    overflow: "hidden",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", // shadow-2xl equivalent
                    height: height,
                    display: 'flex', // Ensure image fills container
                }}
            >
                <img
                    src={src}
                    alt={alt}
                    style={{
                        height: '100%',
                        width: 'auto',
                        objectFit: 'contain',
                        borderRadius: "16px",
                        position: 'relative',
                        zIndex: 10
                    }}
                />
                
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
