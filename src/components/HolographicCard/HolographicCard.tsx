'use client';

import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

  const [isHovered, setIsHovered] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const [touchActive, setTouchActive] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const lastTouchRef = useRef({ x: 0, y: 0 });

  const handleFlip = useCallback(() => {
    if (backContent) {
      setIsFlipped(prev => !prev);
    }
  }, [backContent]);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);



  useEffect(() => {
    if (!isMobile || !cardRef.current) return;

    const card = cardRef.current;
    let touchStartTime = 0;
    let touchMoved = false;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const rect = card.getBoundingClientRect();
      touchStartRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
      lastTouchRef.current = touchStartRef.current;
      setTouchActive(true);
      touchStartTime = Date.now();
      touchMoved = false;
      
      card.classList.add(styles.touchActive);
    };

    let lastUpdateTime = 0;
    const throttleDelay = 16;

    const handleTouchMove = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastUpdateTime < throttleDelay) return;
      lastUpdateTime = now;

      const touch = e.touches[0];
      const rect = card.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;

      const deltaX = Math.abs(touchX - touchStartRef.current.x);
      const deltaY = Math.abs(touchY - touchStartRef.current.y);
      
      if (deltaX > 10 || deltaY > 10) {
        touchMoved = true;
      }

      lastTouchRef.current = { x: touchX, y: touchY };


    };

    const handleTouchEnd = () => {
      const touchEndTime = Date.now();
      const touchDuration = touchEndTime - touchStartTime;
      
      if (touchDuration < 300 && !touchMoved) {
        setTimeout(() => {
          handleFlip();
        }, 50);
      }
      
      setTouchActive(false);
      
      card.classList.remove(styles.touchActive);
      

    };

    card.addEventListener('touchstart', handleTouchStart, { passive: true });
    card.addEventListener('touchmove', handleTouchMove, { passive: true });
    card.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      card.removeEventListener('touchstart', handleTouchStart);
      card.removeEventListener('touchmove', handleTouchMove);
      card.removeEventListener('touchend', handleTouchEnd);
      setTouchActive(false);
    };
  }, [isMobile]);





  const handleClick = (e: React.MouseEvent) => {
    if (!isMobile || !('ontouchstart' in window)) {
      handleFlip();
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovered(false);
    }
  };

  const transformStyle = useMemo(() => {
    const baseTransform = isFlipped ? 'rotateY(180deg)' : '';
    
    if (isMobile) {
      const mobileScale = touchActive ? 'scale(1.02)' : 'scale(1)';
      return `${baseTransform} ${mobileScale}`.trim();
    } else {
      const hoverTransform = isHovered ? 'scale(1.05)' : '';
      return `${baseTransform} ${hoverTransform}`.trim();
    }
  }, [isFlipped, isMobile, touchActive, isHovered]);

  return (
    <div
      className={`${styles.cardContainer} ${className} ${isMobile ? styles.mobile : ''}`}
      style={{
        width,
        height,
      }}
    >
      <div
        ref={cardRef}
        className={`${styles.card} ${isFlipped ? styles.flipped : ''} ${isHovered ? styles.hovered : ''} ${touchActive ? styles.touchActive : ''}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={
          {


            transform: transformStyle,
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
          {isFlipped ? 'Tap to ticket see front' : 'Tap to ticket see back'}
        </div>
      )}
    </div>
  );
}
