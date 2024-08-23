"use client"
import { useState, useEffect } from 'react';
import Footer from "./Footer";
import InfoSection from "./InfoSection";
import LastSection from "./LastSection";
import PastGuests from "./PastGuests";
import PerfectEscape from "./PerfectEscape";
import SleepingArrangements from "./SleepingArrangements";

const Hero = () => {
  const images = [
    '/cabin_img.jpg',
    '/house_img.jpeg',
    '/kitchen_cabin.jpg',
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [isEntering, setIsEntering] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsEntering(false);
      setTimeout(() => {
        setCurrentImage((prevImage) => (prevImage + 1) % images.length);
        setIsEntering(true);
      }, 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div>
      <section
        className={`relative h-screen bg-cover bg-center transition-opacity duration-1000 ${
          isEntering ? 'opacity-90' : 'opacity-0'
        }`}
        style={{ backgroundImage: `url(${images[currentImage]})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center text-white flex flex-col justify-center items-center h-full">
          <h1 className="text-4xl md:text-6xl font-bold">Experience the perfect combination of modern housing & natural scenery.</h1>
          <p className="mt-4 text-lg md:text-2xl">LOCATED IN SOUSSE, TUNISIA</p>
        </div>
      </section>
      <main className="flex flex-col items-center justify-center min-h-screen">
        <InfoSection />
        <SleepingArrangements />
        <PerfectEscape />
        <PastGuests />
        <LastSection />
        <Footer />
      </main>
    </div>
  );
};

export default Hero;
