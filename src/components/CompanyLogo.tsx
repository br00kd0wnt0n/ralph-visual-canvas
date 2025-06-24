import React, { useMemo } from 'react';
import { useVisualStore } from '../store/visualStore';

interface CompanyLogoProps {
  className?: string;
}

const CompanyLogo: React.FC<CompanyLogoProps> = ({ className }) => {
  const { logo } = useVisualStore();
  
  // Calculate position styles - ALWAYS call this hook
  const positionStyles = useMemo(() => {
    const styles: React.CSSProperties = {
      position: 'absolute',
      zIndex: 10000,
      pointerEvents: 'none',
    };

    // Horizontal positioning
    switch (logo.position.x) {
      case 'left':
        styles.left = `${20 + logo.offset.x}px`;
        break;
      case 'right':
        styles.right = `${20 - logo.offset.x}px`;
        break;
      case 'center':
      default:
        styles.left = '50%';
        styles.transform = 'translateX(-50%)';
        if (logo.offset.x !== 0) {
          styles.transform = `translateX(calc(-50% + ${logo.offset.x}px))`;
        }
        break;
    }

    // Vertical positioning
    switch (logo.position.y) {
      case 'bottom':
        styles.bottom = `${20 - logo.offset.y}px`;
        break;
      case 'center':
        styles.top = '50%';
        styles.transform = logo.position.x === 'center' 
          ? `translate(-50%, -50%) translateX(${logo.offset.x}px) translateY(${logo.offset.y}px)`
          : `translateY(-50%) translateY(${logo.offset.y}px)`;
        break;
      case 'top':
      default:
        styles.top = `${20 + logo.offset.y}px`;
        break;
    }

    return styles;
  }, [logo.position, logo.offset]);

  // Calculate animation styles - ALWAYS call this hook
  const animationStyles = useMemo(() => {
    const styles: React.CSSProperties = {
      opacity: logo.opacity,
      width: `${logo.size}px`,
      height: `${logo.size}px`,
    };

    if (logo.animation.enabled) {
      switch (logo.animation.type) {
        case 'pulse':
          styles.animation = `logo-pulse ${2 / logo.animation.speed}s ease-in-out infinite`;
          break;
        case 'float':
          styles.animation = `logo-float ${3 / logo.animation.speed}s ease-in-out infinite`;
          break;
        case 'rotate':
          styles.animation = `logo-rotate ${4 / logo.animation.speed}s linear infinite`;
          break;
        case 'none':
        default:
          // No animation
          break;
      }
    }

    return styles;
  }, [logo.size, logo.opacity, logo.animation]);

  // Don't render if logo is disabled - AFTER all hooks are called
  if (!logo.enabled) {
    return null;
  }

  return (
    <>
      <div 
        className={`company-logo ${className || ''}`}
        style={{
          ...positionStyles,
          ...animationStyles,
        }}
      >
        {/* Company Logo GIF with slow playback effect */}
        <img 
          src="/ralph-logo.gif"
          alt="Company Logo"
          className="logo-gif-slow"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes logo-pulse {
          0%, 100% { 
            transform: ${logo.position.x === 'center' ? 'translateX(-50%)' : 'none'} scale(1);
          }
          50% { 
            transform: ${logo.position.x === 'center' ? 'translateX(-50%)' : 'none'} scale(1.05);
          }
        }
        
        @keyframes logo-float {
          0%, 100% { 
            transform: ${logo.position.x === 'center' ? 'translateX(-50%)' : 'none'} translateY(0px);
          }
          50% { 
            transform: ${logo.position.x === 'center' ? 'translateX(-50%)' : 'none'} translateY(-10px);
          }
        }
        
        @keyframes logo-rotate {
          0% { 
            transform: ${logo.position.x === 'center' ? 'translateX(-50%)' : 'none'} rotate(0deg);
          }
          100% { 
            transform: ${logo.position.x === 'center' ? 'translateX(-50%)' : 'none'} rotate(360deg);
          }
        }
        
        /* Slow GIF playback effect using CSS animation timing */
        .logo-gif-slow {
          animation: slow-gif-playback 10s steps(1) infinite;
        }
        
        @keyframes slow-gif-playback {
          0% { 
            animation-delay: 0s;
          }
          10% { 
            animation-delay: 1s;
          }
          20% { 
            animation-delay: 2s;
          }
          30% { 
            animation-delay: 3s;
          }
          40% { 
            animation-delay: 4s;
          }
          50% { 
            animation-delay: 5s;
          }
          60% { 
            animation-delay: 6s;
          }
          70% { 
            animation-delay: 7s;
          }
          80% { 
            animation-delay: 8s;
          }
          90% { 
            animation-delay: 9s;
          }
          100% { 
            animation-delay: 10s;
          }
        }
        
        .company-logo {
          transition: all 0.3s ease;
        }
        
        .company-logo:hover {
          transform: ${logo.position.x === 'center' ? 'translateX(-50%)' : 'none'} scale(1.02);
        }
      `}</style>
    </>
  );
};

export default CompanyLogo; 