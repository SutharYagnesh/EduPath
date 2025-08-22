"use client"
import { useRef } from "react"
import { useState } from "react"

import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

export const TextHoverEffect = ({ text, className }) => {
  const svgRef = useRef(null)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" })

  return (
    <div className={cn("h-[40rem] flex items-center justify-center", className)}>
      <motion.div
        ref={svgRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={(e) => {
          const rect = svgRef.current.getBoundingClientRect()
          setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top })
          setMaskPosition({
            cx: ((e.clientX - rect.left) / rect.width) * 100 + "%",
            cy: ((e.clientY - rect.top) / rect.height) * 100 + "%",
          })
        }}
        className="text-6xl font-bold cursor-default relative"
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 300 100"
          xmlns="http://www.w3.org/2000/svg"
          className="select-none"
        >
          <defs>
            <linearGradient id="textGradient" gradientUnits="userSpaceOnUse" cx="50%" cy="50%" r="25%">
              {hovered && (
                <>
                  <stop offset="0%" stopColor={"var(--yellow-500)"} />
                  <stop offset="25%" stopColor={"var(--red-500)"} />
                  <stop offset="50%" stopColor={"var(--blue-500)"} />
                  <stop offset="75%" stopColor={"var(--cyan-500)"} />
                  <stop offset="100%" stopColor={"var(--violet-500)"} />
                </>
              )}
            </linearGradient>

            <motion.radialGradient
              id="revealMask"
              gradientUnits="userSpaceOnUse"
              r="20%"
              animate={maskPosition}
              transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
            >
              <stop offset="0%" stopColor="white" />
              <stop offset="100%" stopColor="black" />
            </motion.radialGradient>
            <mask id="textMask">
              <rect x="0" y="0" width="100%" height="100%" fill="url(#revealMask)" />
            </mask>
          </defs>
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            strokeWidth="0.3"
            className="font-[helvetica] font-bold stroke-neutral-200 fill-transparent text-7xl"
            style={{ opacity: hovered ? 0.7 : 0 }}
          >
            {text}
          </text>
          <motion.text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            strokeWidth="0.3"
            className="font-[helvetica] font-bold fill-transparent text-7xl stroke-neutral-200"
            initial={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
            animate={{
              strokeDasharray: 1000,
              strokeDashoffset: hovered ? 0 : 1000,
            }}
            transition={{
              duration: 4,
              ease: "easeInOut",
            }}
          >
            {text}
          </motion.text>
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            stroke="url(#textGradient)"
            strokeWidth="0.3"
            mask="url(#textMask)"
            className="font-[helvetica] font-bold fill-transparent text-7xl"
          >
            {text}
          </text>
        </svg>
      </motion.div>
    </div>
  )
}
