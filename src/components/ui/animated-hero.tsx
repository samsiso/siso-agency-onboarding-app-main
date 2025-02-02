import { useEffect, useState } from "react";
import { GradientText } from "./gradient-text";

export const AnimatedHero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const titles = [
    "Innovate, Scale, Succeed",
    "Collaborate with 1M+ Agencies",
    "Future-Proof Your Agency"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % titles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div className="flex gap-4 flex-col items-center">
            <h1 className="text-6xl md:text-8xl max-w-5xl tracking-tighter text-center font-regular">
              <GradientText
                colors={["#FF5722", "#FFA726", "#FF5722"]}
                className="text-siso-text-bold whitespace-nowrap"
                animationSpeed={6}
              >
                Built for Agencies to
              </GradientText>
              <div className="relative h-[150px] md:h-[200px] flex w-full justify-center overflow-hidden text-center">
                <div
                  className="absolute transition-all duration-500 ease-in-out"
                  style={{
                    transform: `translateY(-${currentIndex * 100}%)`,
                  }}
                >
                  {titles.map((title, index) => (
                    <div
                      key={index}
                      className="h-[150px] md:h-[200px] flex items-center justify-center"
                    >
                      <GradientText
                        colors={["#FFA726", "#FF5722", "#FFA726"]}
                        className="text-gradient bg-clip-text"
                        animationSpeed={4}
                        showBorder
                      >
                        {title}
                      </GradientText>
                    </div>
                  ))}
                </div>
              </div>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-siso-text max-w-2xl text-center mx-auto">
              Your gateway to tools, education, networking, and AI-powered innovation—crafted 
              to help your agency thrive in the digital age. Access our curated collection 
              of resources designed for modern business growth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};