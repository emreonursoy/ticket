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
  const [isMobile, setIsMobile] = useState(false);
  const [touchActive, setTouchActive] = useState(false);
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const lastTouchRef = useRef({ x: 0, y: 0 });

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
    if (isMobile) return;

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
  }, [isMobile]);

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

    const handleTouchMove = (e: TouchEvent) => {
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

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const maxTilt = 20;
      
      const tiltX = ((touchY - centerY) / centerY) * maxTilt;
      const tiltY = ((touchX - centerX) / centerX) * maxTilt;

      setTilt({ x: tiltX, y: tiltY });
      setMousePosition({ x: touchX - centerX, y: touchY - centerY });
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndTime = Date.now();
      const touchDuration = touchEndTime - touchStartTime;
      
      if (touchDuration < 300 && !touchMoved) {
        setTimeout(() => {
          handleFlip();
        }, 50);
      }
      
      setTouchActive(false);
      
      card.classList.remove(styles.touchActive);
      
      setTimeout(() => {
        setTilt({ x: 0, y: 0 });
      }, 100);
    };

    card.addEventListener('touchstart', handleTouchStart, { passive: true });
    card.addEventListener('touchmove', handleTouchMove, { passive: true });
    card.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      card.removeEventListener('touchstart', handleTouchStart);
      card.removeEventListener('touchmove', handleTouchMove);
      card.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, isFlipped]);

  useEffect(() => {
    if (!isMobile) return;

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
        setDeviceOrientation({
          alpha: event.alpha,
          beta: event.beta,
          gamma: event.gamma
        });

        const maxTilt = 8;
        const tiltX = ((event.beta - 45) / 45) * maxTilt;
        const tiltY = (event.gamma / 45) * maxTilt;

        if (!touchActive) {
          setTilt({ x: tiltX, y: tiltY });
        }
      }
    };

    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((permission: string) => {
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleDeviceOrientation);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, [isMobile, touchActive]);

  const handleFlip = () => {
    if (backContent) {
      setIsFlipped(!isFlipped);
    }
  };

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
      setTilt({ x: 0, y: 0 });
    }
  };

  const getTransformStyle = () => {
    const baseTransform = isFlipped ? 'rotateY(180deg)' : '';
    
    if (isMobile) {
      const mobileTilt = `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`;
      const mobileScale = touchActive ? 'scale(1.02)' : 'scale(1)';
      return `${baseTransform} ${mobileTilt} ${mobileScale}`.trim();
    } else {
      const hoverTransform = isHovered
        ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.05)`
        : '';
      return `${baseTransform} ${hoverTransform}`.trim();
    }
  };

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
            '--mouse-x': `${mousePosition.x}px`,
            '--mouse-y': `${mousePosition.y}px`,
            '--tilt-x': `${tilt.x}deg`,
            '--tilt-y': `${tilt.y}deg`,
            '--device-alpha': `${deviceOrientation.alpha}deg`,
            '--device-beta': `${deviceOrientation.beta}deg`,
            '--device-gamma': `${deviceOrientation.gamma}deg`,
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
          {isFlipped ? 'Tap to ticket see front' : 'Tap to ticket see back'}
        </div>
      )}
      
      {isMobile && (
        <div className={styles.mobileDebug}>
          <div>Mobile Mode: {touchActive ? 'Touch Active' : 'Idle'}</div>
          <div>Current Side: {isFlipped ? 'BACK' : 'FRONT'}</div>
          <div>Tilt: X: {Math.round(tilt.x)}°, Y: {Math.round(tilt.y)}°</div>
          <div>Touch Area: Active</div>
        </div>
      )}
    </div>
  );
}
