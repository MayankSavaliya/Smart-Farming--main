import React, { useState, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

/**
 * Optimized LazyImage component with intersection observer
 * Only loads images when they enter the viewport
 */
const LazyImage = React.memo(({ 
  src, 
  alt, 
  className = '', 
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
  });

  useEffect(() => {
    if (isIntersecting && src && !imageSrc) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
    }
  }, [isIntersecting, src, imageSrc]);

  return (
    <div ref={ref} className="relative overflow-hidden">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={alt}
          className={`${className} ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300`}
          loading="lazy"
          {...props}
        />
      ) : (
        <div className={`${className} bg-gray-200 animate-pulse`} />
      )}
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;
