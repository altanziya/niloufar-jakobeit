'use client';

import { useEffect, useState } from 'react';
import SectionRenderer from '@/components/layout/SectionRenderer';
import { sections } from '@/config/sections';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Mark page as loaded and ensure scrollability
  useEffect(() => {
    setIsLoaded(true);
    
    // Force document body to be scrollable
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.body.style.overscrollBehavior = 'auto'; // Important for iOS
    
    return () => {
      // Cleanup if needed
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.overscrollBehavior = '';
    };
  }, []);

  if (!isLoaded) return null;
  
  // Error fallback
  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800 p-4">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-4">There was an error loading this page. Please try refreshing.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  try {
    return (
      <div className="bg-[#f8f7f5]"> {/* Off-White Hintergrund */}
        <SectionRenderer 
          sections={sections} 
          useParallaxTransition={true} 
        />
      </div>
    );
  } catch (error) {
    console.error('Error rendering page:', error);
    setHasError(true);
    return null;
  }
}