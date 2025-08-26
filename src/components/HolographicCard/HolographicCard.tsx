'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';
import styles from './HolographicCard.module.scss';

interface HolographicCardProps {
  children: ReactNode;
  backContent?: ReactNode;
  className?: string;
  width?: string;
  height?: string;
  showFlipHint?: boolean;
}

export default function HolographicCard({
  children,
  backContent,
  className = '',
  width = '900px',
  height = '350px',
  showFlipHint = true,
}: HolographicCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      setMousePosition({ x: mouseX, y: mouseY });

      const maxTilt = 15;
      const tiltX = (mouseY / (rect.height / 2)) * maxTilt;
      const tiltY = (mouseX / (rect.width / 2)) * maxTilt;

      setTilt({ x: tiltX, y: tiltY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleFlip = () => {
    if (backContent) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const getTransformStyle = () => {
    const baseTransform = isFlipped ? 'rotateY(180deg)' : '';
    const hoverTransform = isHovered
      ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.05)`
      : '';

    return `${baseTransform} ${hoverTransform}`.trim();
  };

  return (
    <div
      className={`${styles.cardContainer} ${className}`}
      style={{
        width,
        height,
      }}
    >
      <div
        ref={cardRef}
        className={`${styles.card} ${isFlipped ? styles.flipped : ''} ${isHovered ? styles.hovered : ''}`}
        onClick={handleFlip}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={
          {
            '--mouse-x': `${mousePosition.x}px`,
            '--mouse-y': `${mousePosition.y}px`,
            '--tilt-x': `${tilt.x}deg`,
            '--tilt-y': `${tilt.y}deg`,
            transform: getTransformStyle(),
            cursor: backContent ? 'pointer' : 'default',
          } as React.CSSProperties
        }
      >
        <div className={styles.cardFace}>
          <div className={styles.holographicBorder}></div>
          <div className={styles.holographicOverlay}></div>
          <div className={styles.rainbowReflection}></div>
          <div className={styles.lightReflection}></div>
          <div className={styles.depthShadow}></div>

          <div className={styles.hoverImage}></div>

          <div className={styles.cardContent}>{children}</div>
        </div>

        {backContent && (
          <div className={`${styles.cardFace} ${styles.cardBack}`}>
            <div className={styles.holographicBorder}></div>
            <div className={styles.holographicOverlay}></div>
            <div className={styles.rainbowReflection}></div>
            <div className={styles.lightReflection}></div>
            <div className={styles.depthShadow}></div>

            <div className={styles.hoverImageBack}></div>

            <div className={styles.cardContent}>{backContent}</div>
          </div>
        )}
      </div>

      {showFlipHint && backContent && (
        <div className={styles.flipHint}>
          {isFlipped ? 'Click to see front' : 'Click to see back'}
        </div>
      )}
    </div>
  );
}
