
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const titles = useMemo(
    () => ["Innovate, Scale, Succeed", "Future-Proof Agencies", "Launch MVPs in 48 Hours"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  const handleGetStarted = () => {
    console.log('Create MVP clicked - navigating to /onboarding-chat');
    try {
      navigate('/onboarding-chat');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-6 sm:gap-8 py-16 sm:py-20 lg:py-32 min-h-[80vh] items-center justify-center flex-col">
          <div className="flex gap-3 sm:gap-4 flex-col items-center">
            <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-8xl max-w-5xl tracking-tighter text-center font-regular`}>
              <span className="text-siso-text-bold whitespace-nowrap">Built for Agencies to</span>
              <div className={`relative ${isMobile ? 'h-[100px]' : 'h-[150px]'} md:h-[200px] flex w-full justify-center overflow-hidden text-center`}>
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </div>
            </h1>

            <p className="text-base sm:text-lg md:text-xl leading-relaxed tracking-tight text-siso-text max-w-2xl text-center mx-auto">
              Trusted by 40+ agencies to deliver fast MVPs.
            </p>
          </div>
          <div className="flex flex-col w-full justify-center">
            <Button 
              size={isMobile ? "default" : "lg"}
              className="mx-auto gap-2 sm:gap-4 bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 sm:min-w-[200px] sm:py-6 text-base sm:text-lg"
              onClick={handleGetStarted}
            >
              Create MVP <MoveRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
