import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // or import { useRouter } from 'next/router' if using Next.js

export default function HeroSection() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const navigate = useNavigate(); // or const router = useRouter() for Next.js

  const handleStartScanning = () => {
    navigate('/prediction'); // or router.push('/prediction') for Next.js
  };

  const handleLearnMore = () => {
    navigate('/mycology'); // or router.push('/mycology') for Next.js
  };

  return (
    <section 
      className="hero-section relative w-full h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] overflow-hidden flex items-center justify-center"
      style={{ 
        touchAction: 'pan-y',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover object-center z-0 brightness-75 pointer-events-none"
        src="/bg_video.mp4"
        onLoadedData={() => setVideoLoaded(true)}
      />
      
      {/* Fallback Background */}
      {!videoLoaded && (
        <div className="absolute inset-0 w-full h-full z-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-black opacity-90 pointer-events-none" />
      )}

      {/* Content Overlay */}
      <div className="hero-content relative z-10 w-full h-full flex flex-col items-center justify-center text-white px-4 sm:px-6 md:px-8 lg:px-12 pointer-events-auto">
        <div className="w-full max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold leading-tight mb-3 sm:mb-4 select-text">
            <span className="block sm:inline"> MycoScan : </span>
            <span className="block sm:inline bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Spot the Safe Mushrooms
            </span>
            <span className="block sm:inline"> Instantly. </span>
          </h2>
          
          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-purple-200 mb-4 sm:mb-6 w-full max-w-2xl mx-auto leading-relaxed px-2 sm:px-0 select-text">
            AI-powered identification of edible and poisonous mushrooms in real time.
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-lg mx-auto">
            <button 
              onClick={handleStartScanning} 
              className="w-full sm:w-auto min-w-[160px] max-w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base cursor-pointer"
            >
              Start Scanning
            </button>
            <button 
              onClick={handleLearnMore}
              className="w-full sm:w-auto min-w-[160px] max-w-full px-6 py-3 border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white rounded-full font-semibold transition-all duration-300 text-sm sm:text-base cursor-pointer"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

    </section>
  );
}