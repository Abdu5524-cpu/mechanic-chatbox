'use client'

import type { ElementType } from 'react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type VehicleProps = {
  className?: string
  color1: string
  color2: string
  isHoverable: boolean
}

type VehicleType = 'motorcycle' | 'car'

type RaceDirection = 'left-to-right' | 'right-to-left'

type RaceEntry = {
  id: number
  type: VehicleType
  direction: RaceDirection
}

type SpeedLinesProps = {
  className?: string
}

type CrossingVehicleProps = {
  type: VehicleType
  delay: number
}

type RacingVehicleProps = {
  type: VehicleType
  direction: RaceDirection
  onComplete: () => void
}

const Car = ({ className, color1, color2, isHoverable }: VehicleProps) => {
  const WrapperComponent: ElementType = isHoverable ? motion.svg : 'svg'
  
  return (
    <WrapperComponent 
      viewBox="0 0 140 70" 
      className={className} 
      fill="none"
      {...(isHoverable ? {
        whileHover: { scale: 1.15, rotate: 5 },
        transition: { type: "spring", stiffness: 300 }
      } : {})}
    >
      {/* Car body - sports car style */}
      <path
        d="M20 45 L28 45 L32 38 L38 32 L55 28 L95 28 L108 36 L118 42 L118 50 L20 50 Z"
        fill={`url(#carGradient${color1})`}
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="0.5"
      />
      {/* Hood scoop */}
      <path d="M85 28 L92 28 L92 32 L85 32 Z" fill="rgba(0,0,0,0.3)" />
      {/* Side skirt */}
      <path d="M35 45 L110 45 L112 48 L33 48 Z" fill="rgba(0,0,0,0.2)" />
      {/* Windows - tinted */}
      <path d="M40 35 L52 30 L52 38 L38 40 Z" fill="rgba(30,30,60,0.8)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
      <path d="M56 30 L90 30 L100 38 L56 38 Z" fill="rgba(30,30,60,0.8)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
      {/* Spoiler */}
      <path d="M100 32 L105 30 L106 34 L102 36 Z" fill={color1} />
      {/* Wheels - sporty */}
      <g>
        <circle cx="38" cy="50" r="10" fill="#1a1a2e" />
        <circle cx="38" cy="50" r="6" fill="#2a2a3e" />
        <circle cx="38" cy="50" r="3" fill="#4a4a6a" />
        <path d="M38 47 L38 53 M35 50 L41 50" stroke="#6a6a8a" strokeWidth="1" />
      </g>
      <g>
        <circle cx="105" cy="50" r="10" fill="#1a1a2e" />
        <circle cx="105" cy="50" r="6" fill="#2a2a3e" />
        <circle cx="105" cy="50" r="3" fill="#4a4a6a" />
        <path d="M105 47 L105 53 M102 50 L108 50" stroke="#6a6a8a" strokeWidth="1" />
      </g>
      {/* Headlights - LED style */}
      <g>
        <rect x="113" y="40" width="4" height="4" rx="1" fill="#fff" opacity="0.9" />
        <rect x="113" y="45" width="4" height="2" rx="0.5" fill="#fef08a" opacity="0.8" />
      </g>
      {/* Tail lights */}
      <rect x="22" y="43" width="3" height="5" rx="1" fill="#ef4444" opacity="0.8" />
      {/* Exhaust */}
      <ellipse cx="26" cy="51" rx="2" ry="1.5" fill="#4a4a6a" />
      <defs>
        <linearGradient id={`carGradient${color1}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color1} />
          <stop offset="50%" stopColor={color2} />
          <stop offset="100%" stopColor={color1} />
        </linearGradient>
      </defs>
    </WrapperComponent>
  )
}

const Motorcycle = ({ className, color1, color2, isHoverable }: VehicleProps) => {
  const WrapperComponent: ElementType = isHoverable ? motion.svg : 'svg'
  
  return (
    <WrapperComponent 
      viewBox="0 0 120 70" 
      className={className} 
      fill="none"
      {...(isHoverable ? {
        whileHover: { scale: 1.2, x: 10 },
        transition: { type: "spring", stiffness: 300 }
      } : {})}
    >
      {/* Front fork */}
      <path d="M32 42 L35 25 L38 22" stroke="#3a3a4a" strokeWidth="3" strokeLinecap="round" />
      {/* Frame - sporty design */}
      <path d="M35 25 L55 22 L75 25 L85 38 L80 42" stroke={`url(#bikeGradient${color1})`} strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M55 22 L58 38" stroke={`url(#bikeGradient${color1})`} strokeWidth="4" strokeLinecap="round" />
      {/* Tank - angular sport bike style */}
      <path d="M48 20 L68 18 L72 26 L52 28 Z" fill={color1} stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
      <path d="M52 22 L66 20 L68 24 L54 26 Z" fill={color2} opacity="0.6" />
      {/* Seat - racing seat */}
      <ellipse cx="78" cy="28" rx="10" ry="5" fill={color2} />
      <ellipse cx="78" cy="28" rx="8" ry="4" fill="rgba(0,0,0,0.3)" />
      {/* Rear cowl */}
      <path d="M85 25 L95 28 L95 35 L88 36 Z" fill={color1} opacity="0.8" />
      {/* Handlebars - sport style */}
      <path d="M35 20 L30 14 M35 20 L40 14" stroke="#5a5a7a" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="30" cy="14" r="2" fill="#6a6a8a" />
      <circle cx="40" cy="14" r="2" fill="#6a6a8a" />
      {/* Front wheel - detailed */}
      <circle cx="28" cy="50" r="12" fill="#1a1a2e" />
      <circle cx="28" cy="50" r="8" fill="#2a2a3e" />
      <circle cx="28" cy="50" r="4" fill="#4a4a6a" />
      <path d="M28 46 L28 54 M24 50 L32 50 M25 47 L31 53 M31 47 L25 53" stroke="#6a6a8a" strokeWidth="0.8" />
      {/* Back wheel - detailed */}
      <circle cx="85" cy="50" r="12" fill="#1a1a2e" />
      <circle cx="85" cy="50" r="8" fill="#2a2a3e" />
      <circle cx="85" cy="50" r="4" fill="#4a4a6a" />
      <path d="M85 46 L85 54 M81 50 L89 50 M82 47 L88 53 M88 47 L82 53" stroke="#6a6a8a" strokeWidth="0.8" />
      {/* Chain */}
      <path d="M58 38 L82 48" stroke="#5a5a6a" strokeWidth="1.5" strokeDasharray="2,2" />
      {/* Exhaust pipes - dual */}
      <path d="M82 40 L98 43 L100 41" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
      <path d="M82 44 L98 47 L100 45" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="100" cy="41" rx="1.5" ry="2" fill="#4a4a5a" />
      <ellipse cx="100" cy="45" rx="1.5" ry="2" fill="#4a4a5a" />
      {/* Headlight - angular LED */}
      <path d="M30 25 L38 23 L38 28 L30 30 Z" fill="#fef08a" opacity="0.9" />
      <path d="M32 26 L36 25 L36 27 L32 28 Z" fill="#fff" opacity="0.8" />
      {/* Tail light */}
      <rect x="93" y="30" width="3" height="4" rx="1" fill="#ef4444" opacity="0.9" />
      {/* Wind screen */}
      <path d="M38 22 L42 18 L44 24 L40 25 Z" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
      <defs>
        <linearGradient id={`bikeGradient${color1}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color1} />
          <stop offset="50%" stopColor={color2} />
          <stop offset="100%" stopColor={color1} />
        </linearGradient>
      </defs>
    </WrapperComponent>
  )
}

const SpeedLines = ({ className }: SpeedLinesProps) => (
  <svg viewBox="0 0 50 20" className={className}>
    <motion.line
      x1="0" y1="5" x2="40" y2="5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ x1: 50 }}
      animate={{ x1: 0 }}
      transition={{ duration: 0.8, repeat: Infinity, repeatType: "loop" }}
    />
    <motion.line
      x1="10" y1="10" x2="45" y2="10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ x1: 50 }}
      animate={{ x1: 10 }}
      transition={{ duration: 0.6, repeat: Infinity, repeatType: "loop", delay: 0.2 }}
    />
    <motion.line
      x1="5" y1="15" x2="35" y2="15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ x1: 50 }}
      animate={{ x1: 5 }}
      transition={{ duration: 0.7, repeat: Infinity, repeatType: "loop", delay: 0.1 }}
    />
  </svg>
)

const VehicleVisual = ({ type, flipped = false }: { type: VehicleType; flipped?: boolean }) => (
  <div className={`relative${flipped ? ' transform scale-x-[-1]' : ''}`}>
    {type === 'motorcycle' ? (
      <>
        <Motorcycle className="w-40 md:w-52 drop-shadow-2xl filter brightness-110" color1="#f59e0b" color2="#ef4444" isHoverable={false} />
        {/* Glowing headlight effect */}
        <motion.div
          className="absolute left-8 top-6 w-20 h-12 bg-gradient-to-r from-yellow-400/0 via-yellow-300/40 to-transparent blur-xl"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
        {/* Speed trails - multiple layers */}
        <motion.div
          className="absolute -left-4 top-1/2 -translate-y-1/2 flex gap-1.5"
          animate={{ opacity: [0, 0.8, 0], x: [-10, 0, 10] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        >
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-8 h-1 bg-gradient-to-r from-orange-500/60 to-transparent rounded-full blur-sm" />
          ))}
        </motion.div>
        {/* Exhaust flames */}
        <motion.div
          className="absolute right-0 top-8 flex gap-1"
          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 0.2, repeat: Infinity }}
        >
          <div className="w-3 h-1 bg-orange-500 rounded-full blur-sm" />
          <div className="w-2 h-1 bg-yellow-400 rounded-full blur-sm" />
        </motion.div>
      </>
    ) : (
      <>
        <Car className="w-44 md:w-56 drop-shadow-2xl filter brightness-110" color1="#3b82f6" color2="#06b6d4" isHoverable={false} />
        {/* Glowing headlight beams */}
        <motion.div
          className="absolute left-8 top-4 w-24 h-16 bg-gradient-to-r from-blue-200/0 via-white/30 to-transparent blur-xl"
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        {/* Speed trails - layered */}
        <motion.div
          className="absolute -left-6 top-1/2 -translate-y-1/2 flex gap-2"
          animate={{ opacity: [0, 0.9, 0], x: [-15, 0, 15] }}
          transition={{ duration: 0.35, repeat: Infinity }}
        >
          {[...Array(7)].map((_, i) => (
            <div key={i} className="w-10 h-1 bg-gradient-to-r from-cyan-400/70 to-transparent rounded-full blur-sm" />
          ))}
        </motion.div>
        {/* Tire smoke */}
        <motion.div
          className="absolute left-8 bottom-0 w-8 h-4 bg-gray-400/40 rounded-full blur-md"
          animate={{ scale: [0.8, 1.2, 0.8], x: [-5, 5, -5] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      </>
    )}
  </div>
)

const CrossingVehicle = ({ type, delay }: CrossingVehicleProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Start the first animation after initial delay
    const startTimer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    // Set up repeating animation
    const interval = setInterval(() => {
      setIsVisible(true)
    }, 15000) // Vehicle crosses every 15 seconds

    return () => {
      clearTimeout(startTimer)
      clearInterval(interval)
    }
  }, [delay])

  useEffect(() => {
    if (isVisible) {
      // Hide after animation completes
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 2500)

      return () => clearTimeout(timer)
    }
  }, [isVisible, type])


  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-1/2 -translate-y-1/2 z-50 pointer-events-none"
          initial={{ x: '-250px' }}
          animate={{ x: 'calc(100vw + 250px)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        >
          <VehicleVisual type={type} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const RacingVehicle = ({ type, direction, onComplete }: RacingVehicleProps) => (
  <motion.div
    className="fixed top-1/2 -translate-y-1/2 z-50 pointer-events-none"
    initial={{ x: direction === 'left-to-right' ? '-250px' : 'calc(100vw + 250px)' }}
    animate={{ x: direction === 'left-to-right' ? 'calc(100vw + 250px)' : '-250px' }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1.8, ease: 'easeInOut' }}
    onAnimationComplete={onComplete}
  >
    <VehicleVisual type={type} flipped={direction === 'right-to-left'} />
  </motion.div>
)

export default function VehicleDecorations() {
  const [races, setRaces] = useState<RaceEntry[]>([])

  const launchRace = (type: VehicleType, direction: RaceDirection) => {
    const id = Date.now() + Math.random()
    setRaces((prev) => [...prev, { id, type, direction }])
  }

  const removeRace = (id: number) => {
    setRaces((prev) => prev.filter((race) => race.id !== id))
  }

  return (
    <>
      {/* Crossing vehicles */}
      <CrossingVehicle type="motorcycle" delay={3000} />
      <CrossingVehicle type="car" delay={10000} />

      <AnimatePresence>
        {races.map((race) => (
          <RacingVehicle
            key={race.id}
            type={race.type}
            direction={race.direction}
            onComplete={() => removeRace(race.id)}
          />
        ))}
      </AnimatePresence>

      {/* Left side decorations */}
      <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 overflow-hidden z-30">
        {/* Top car */}
        <motion.button
          type="button"
          aria-label="Race car across the screen"
          className="absolute top-20 -left-4 cursor-pointer group bg-transparent border-0 p-0 z-40"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onClick={() => launchRace('car', 'left-to-right')}
          whileTap={{ scale: 0.96 }}
        >
          <Car className="w-28 md:w-36 drop-shadow-lg transition-all duration-300" color1="#ec4899" color2="#f97316" isHoverable={true} />
          <SpeedLines className="w-12 text-pink-400/60 absolute -left-8 top-1/2 -translate-y-1/2" />
          <motion.div
            className="absolute inset-0 bg-pink-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 -z-10"
            transition={{ duration: 0.3 }}
          />
        </motion.button>

        {/* Middle motorcycle */}
        <motion.button
          type="button"
          aria-label="Race motorcycle across the screen"
          className="absolute top-1/2 -translate-y-1/2 -left-2 cursor-pointer group bg-transparent border-0 p-0 z-40"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onClick={() => launchRace('motorcycle', 'left-to-right')}
          whileTap={{ scale: 0.96 }}
        >
          <Motorcycle className="w-24 md:w-32 drop-shadow-lg transition-all duration-300" color1="#22d3ee" color2="#3b82f6" isHoverable={true} />
          <SpeedLines className="w-10 text-cyan-400/60 absolute -left-6 top-1/2 -translate-y-1/2" />
          <motion.div
            className="absolute inset-0 bg-cyan-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 -z-10"
            transition={{ duration: 0.3 }}
          />
        </motion.button>

        {/* Bottom car */}
        <motion.button
          type="button"
          aria-label="Race car across the screen"
          className="absolute bottom-24 -left-6 cursor-pointer group bg-transparent border-0 p-0 z-40"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          onClick={() => launchRace('car', 'left-to-right')}
          whileTap={{ scale: 0.96 }}
        >
          <Car className="w-32 md:w-40 drop-shadow-lg transition-all duration-300" color1="#a855f7" color2="#6366f1" isHoverable={true} />
          <SpeedLines className="w-14 text-purple-400/60 absolute -left-10 top-1/2 -translate-y-1/2" />
          <motion.div
            className="absolute inset-0 bg-purple-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 -z-10"
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </div>

      {/* Right side decorations */}
      <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 overflow-hidden z-30">
        {/* Top motorcycle */}
        <motion.button
          type="button"
          aria-label="Race motorcycle across the screen"
          className="absolute top-32 -right-2 transform scale-x-[-1] cursor-pointer group bg-transparent border-0 p-0 z-40"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          onClick={() => launchRace('motorcycle', 'right-to-left')}
          whileTap={{ scale: 0.96 }}
        >
          <Motorcycle className="w-24 md:w-32 drop-shadow-lg transition-all duration-300" color1="#f97316" color2="#eab308" isHoverable={true} />
          <SpeedLines className="w-10 text-orange-400/60 absolute -right-6 top-1/2 -translate-y-1/2 scale-x-[-1]" />
          <motion.div
            className="absolute inset-0 bg-orange-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 -z-10 scale-x-[-1]"
            transition={{ duration: 0.3 }}
          />
        </motion.button>

        {/* Middle car */}
        <motion.button
          type="button"
          aria-label="Race car across the screen"
          className="absolute top-1/2 -translate-y-1/2 -right-4 transform scale-x-[-1] cursor-pointer group bg-transparent border-0 p-0 z-40"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          onClick={() => launchRace('car', 'right-to-left')}
          whileTap={{ scale: 0.96 }}
        >
          <Car className="w-28 md:w-36 drop-shadow-lg transition-all duration-300" color1="#10b981" color2="#22d3ee" isHoverable={true} />
          <SpeedLines className="w-12 text-emerald-400/60 absolute -right-8 top-1/2 -translate-y-1/2 scale-x-[-1]" />
          <motion.div
            className="absolute inset-0 bg-emerald-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 -z-10 scale-x-[-1]"
            transition={{ duration: 0.3 }}
          />
        </motion.button>

        {/* Bottom motorcycle */}
        <motion.button
          type="button"
          aria-label="Race motorcycle across the screen"
          className="absolute bottom-32 -right-0 transform scale-x-[-1] cursor-pointer group bg-transparent border-0 p-0 z-40"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          onClick={() => launchRace('motorcycle', 'right-to-left')}
          whileTap={{ scale: 0.96 }}
        >
          <Motorcycle className="w-28 md:w-36 drop-shadow-lg transition-all duration-300" color1="#ec4899" color2="#a855f7" isHoverable={true} />
          <SpeedLines className="w-12 text-pink-400/60 absolute -right-8 top-1/2 -translate-y-1/2 scale-x-[-1]" />
          <motion.div
            className="absolute inset-0 bg-pink-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 -z-10 scale-x-[-1]"
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-10 left-1/4 w-3 h-3 rounded-full bg-cyan-400"
        animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-20 right-1/4 w-2 h-2 rounded-full bg-pink-400"
        animate={{ y: [0, -15, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-32 left-1/3 w-4 h-4 rounded-full bg-orange-400"
        animate={{ y: [0, -8, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
      />
    </>
  )
}
