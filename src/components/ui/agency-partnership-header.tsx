"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowRight, Users, Handshake, TrendingUp, Star, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

// Utils function
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

// TextRotate component implementation
interface TextRotateProps {
  texts: string[]
  rotationInterval?: number
  initial?: any
  animate?: any
  exit?: any
  animatePresenceMode?: "wait" | "sync" | "popLayout"
  animatePresenceInitial?: boolean
  staggerDuration?: number
  staggerFrom?: "first" | "last" | "center" | number | "random"
  transition?: any
  loop?: boolean
  auto?: boolean
  splitBy?: "words" | "characters" | "lines" | string
  onNext?: (index: number) => void
  mainClassName?: string
  splitLevelClassName?: string
  elementLevelClassName?: string
}

const TextRotate: React.FC<TextRotateProps> = ({
  texts,
  transition = { type: "spring", damping: 25, stiffness: 300 },
  initial = { y: "100%", opacity: 0 },
  animate = { y: 0, opacity: 1 },
  exit = { y: "-120%", opacity: 0 },
  rotationInterval = 2000,
  staggerDuration = 0,
  staggerFrom = "first",
  loop = true,
  auto = true,
  splitBy = "characters",
  onNext,
  mainClassName,
  splitLevelClassName,
  elementLevelClassName,
}) => {
  const [currentTextIndex, setCurrentTextIndex] = React.useState(0)

  const splitIntoCharacters = (text: string): string[] => {
    if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
      const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" })
      return Array.from(segmenter.segment(text), ({ segment }) => segment)
    }
    return Array.from(text)
  }

  const elements = React.useMemo(() => {
    const currentText = texts[currentTextIndex]
    if (splitBy === "characters") {
      const text = currentText.split(" ")
      return text.map((word, i) => ({
        characters: splitIntoCharacters(word),
        needsSpace: i !== text.length - 1,
      }))
    }
    return splitBy === "words"
      ? currentText.split(" ")
      : splitBy === "lines"
        ? currentText.split("\n")
        : currentText.split(splitBy)
  }, [texts, currentTextIndex, splitBy])

  const getStaggerDelay = React.useCallback(
    (index: number, totalChars: number) => {
      const total = totalChars
      if (staggerFrom === "first") return index * staggerDuration
      if (staggerFrom === "last") return (total - 1 - index) * staggerDuration
      if (staggerFrom === "center") {
        const center = Math.floor(total / 2)
        return Math.abs(center - index) * staggerDuration
      }
      if (staggerFrom === "random") {
        const randomIndex = Math.floor(Math.random() * total)
        return Math.abs(randomIndex - index) * staggerDuration
      }
      return Math.abs(staggerFrom - index) * staggerDuration
    },
    [staggerFrom, staggerDuration]
  )

  const handleIndexChange = React.useCallback((newIndex: number) => {
    setCurrentTextIndex(newIndex)
    onNext?.(newIndex)
  }, [onNext])

  const next = React.useCallback(() => {
    const nextIndex = currentTextIndex === texts.length - 1
      ? (loop ? 0 : currentTextIndex)
      : currentTextIndex + 1
    
    if (nextIndex !== currentTextIndex) {
      handleIndexChange(nextIndex)
    }
  }, [currentTextIndex, texts.length, loop, handleIndexChange])

  React.useEffect(() => {
    if (!auto) return
    const intervalId = setInterval(next, rotationInterval)
    return () => clearInterval(intervalId)
  }, [next, rotationInterval, auto])

  return (
    <motion.span
      className={cn("flex flex-wrap whitespace-pre-wrap", mainClassName)}
      layout
      transition={transition}
    >
      <span className="sr-only">{texts[currentTextIndex]}</span>

      <motion.div
        key={currentTextIndex}
        className={cn(
          "flex flex-wrap",
          splitBy === "lines" && "flex-col w-full"
        )}
        layout
        aria-hidden="true"
      >
        {(splitBy === "characters"
          ? (elements as any[])
          : (elements as string[]).map((el, i) => ({
              characters: [el],
              needsSpace: i !== elements.length - 1,
            }))
        ).map((wordObj: any, wordIndex: number, array: any[]) => {
          const previousCharsCount = array
            .slice(0, wordIndex)
            .reduce((sum, word) => sum + word.characters.length, 0)

          return (
            <span
              key={wordIndex}
              className={cn("inline-flex", splitLevelClassName)}
            >
              {wordObj.characters.map((char: string, charIndex: number) => (
                <motion.span
                  initial={initial}
                  animate={animate}
                  exit={exit}
                  key={charIndex}
                  transition={{
                    ...transition,
                    delay: getStaggerDelay(
                      previousCharsCount + charIndex,
                      array.reduce(
                        (sum, word) => sum + word.characters.length,
                        0
                      )
                    ),
                  }}
                  className={cn("inline-block", elementLevelClassName)}
                >
                  {char}
                </motion.span>
              ))}
              {wordObj.needsSpace && (
                <span className="whitespace-pre"> </span>
              )}
            </span>
          )
        })}
      </motion.div>
    </motion.span>
  )
}

// ButtonColorful component implementation
interface ButtonColorfulProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
}

const ButtonColorful: React.FC<ButtonColorfulProps> = ({
  className,
  label = "Explore Components",
  ...props
}) => {
  return (
    <Button
      className={cn(
        "relative h-12 px-8 overflow-hidden",
        "bg-gradient-to-r from-orange-500 to-yellow-500",
        "transition-all duration-200",
        "group",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "absolute inset-0",
          "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
          "opacity-40 group-hover:opacity-80",
          "blur transition-opacity duration-500"
        )}
      />

      <div className="relative flex items-center justify-center gap-2">
        <span className="text-white font-semibold">{label}</span>
        <ArrowRight className="w-4 h-4 text-white/90" />
      </div>
    </Button>
  )
}

// Main Agency Partnership Header component
interface AgencyPartnershipHeaderProps {
  className?: string
}

const AgencyPartnershipHeader: React.FC<AgencyPartnershipHeaderProps> = ({
  className = ""
}) => {
  const partnershipTypes = [
    "referral commissions",
    "web app solutions",
    "MVP development", 
    "client partnerships",
    "revenue sharing",
    "business growth"
  ]

  const benefits = [
    { icon: TrendingUp, text: "Earn 20% Commission" },
    { icon: Users, text: "48hr MVP Delivery" },
    { icon: Handshake, text: "Zero Risk Guarantee" },
    { icon: Star, text: "Full Technical Support" }
  ]

  return (
    <section className={cn(
      "relative min-h-screen bg-black text-white overflow-hidden",
      className
    )}>
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 isolate z-0 flex w-screen flex-1 items-start justify-center">
          <div className="absolute top-0 z-50 h-48 w-screen bg-transparent opacity-10 backdrop-blur-md" />
          
          {/* Main glow */}
          <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-[-30%] rounded-full bg-gradient-to-r from-orange-500/60 to-yellow-500/60 opacity-80 blur-3xl" />

          {/* Lamp effect */}
          <motion.div
            initial={{ width: "8rem" }}
            viewport={{ once: true }}
            transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
            whileInView={{ width: "16rem" }}
            className="absolute top-0 z-30 h-36 -translate-y-[20%] rounded-full bg-gradient-to-r from-orange-500/60 to-yellow-500/60 blur-2xl"
          />

          {/* Top line */}
          <motion.div
            initial={{ width: "15rem" }}
            viewport={{ once: true }}
            transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
            whileInView={{ width: "30rem" }}
            className="absolute inset-auto z-50 h-0.5 -translate-y-[-10%] bg-gradient-to-r from-orange-500/60 to-yellow-500/60"
          />

          {/* Left gradient cone */}
          <motion.div
            initial={{ opacity: 0.5, width: "15rem" }}
            whileInView={{ opacity: 1, width: "30rem" }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            style={{
              backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            }}
            className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-orange-500/60 via-transparent to-transparent [--conic-position:from_70deg_at_center_top]"
          >
            <div className="absolute w-[100%] left-0 bg-black h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
            <div className="absolute w-40 h-[100%] left-0 bg-black bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
          </motion.div>

          {/* Right gradient cone */}
          <motion.div
            initial={{ opacity: 0.5, width: "15rem" }}
            whileInView={{ opacity: 1, width: "30rem" }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            style={{
              backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            }}
            className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-yellow-500/60 [--conic-position:from_290deg_at_center_top]"
          >
            <div className="absolute w-40 h-[100%] right-0 bg-black bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
            <div className="absolute w-[100%] right-0 bg-black h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-50 container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          viewport={{ once: true }}
          transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
          whileInView={{ y: 0, opacity: 1 }}
          className="text-center space-y-8 max-w-5xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-base leading-relaxed tracking-tight font-regular"
          >
            <Handshake className="w-4 h-4" />
            Partnership Program
          </motion.div>

          {/* Main heading */}
          <div className="space-y-4">
            <h1 className="text-xl md:text-3xl md:text-5xl tracking-tighter lg:max-w-4xl font-regular text-center">
              <span className="block text-white">Scale your agency with</span>
              <span className="block bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                <TextRotate
                  texts={partnershipTypes}
                  rotationInterval={3000}
                  staggerDuration={0.02}
                  mainClassName="inline-block"
                />
              </span>
            </h1>
            
            <p className="text-lg leading-relaxed tracking-tight text-gray-300 max-w-3xl mx-auto">
              Partner with SISO and earn 20% commission on every web solution referral. 
              We build MVPs in 48 hours with zero risk to your clients.
            </p>
          </div>

          {/* Benefits grid */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                className="flex items-center gap-3 p-4 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-orange-500/30 transition-colors"
              >
                <benefit.icon className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <span className="text-base leading-relaxed tracking-tight text-white font-regular">{benefit.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
          >
            <ButtonColorful 
              label="Start Earning Today"
              className="text-lg px-8 py-4 h-14"
            />
            
            <Button 
              variant="outline" 
              size="lg"
              className="h-14 px-8 text-lg border-2 border-orange-500/50 text-orange-400 hover:bg-orange-500/5 hover:border-orange-400"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-16 text-base leading-relaxed tracking-tight text-gray-400"
          >
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span>50+ Active Partners</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>£500+ Per Deal</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-500" />
              <span>48hr Delivery</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Usage example
export default function AgencyPartnershipDemo() {
  return <AgencyPartnershipHeader />
}

export { AgencyPartnershipHeader, TextRotate, ButtonColorful }