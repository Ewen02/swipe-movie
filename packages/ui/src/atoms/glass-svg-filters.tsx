"use client"

import * as React from "react"

/**
 * SVG Filters for Liquid Glass Effects (iOS 26 Style)
 * These filters create realistic refraction and distortion effects
 */
export function LiquidGlassFilters() {
  return (
    <svg
      className="absolute w-0 h-0 overflow-hidden"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Basic Glass Blur Filter */}
        <filter id="glass-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feColorMatrix
            in="blur"
            type="saturate"
            values="1.5"
            result="saturated"
          />
        </filter>

        {/* Liquid Glass Refraction Filter */}
        <filter id="liquid-glass-refract" x="-20%" y="-20%" width="140%" height="140%">
          {/* Blur the background slightly */}
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blurred" />

          {/* Create turbulence for organic distortion */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01"
            numOctaves="2"
            seed="1"
            result="noise"
          />

          {/* Use noise for displacement (refraction simulation) */}
          <feDisplacementMap
            in="blurred"
            in2="noise"
            scale="8"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />

          {/* Boost saturation for vibrancy */}
          <feColorMatrix
            in="displaced"
            type="saturate"
            values="1.3"
            result="final"
          />
        </filter>

        {/* Specular Highlight Filter */}
        <filter id="glass-specular" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
          <feSpecularLighting
            in="blur"
            surfaceScale="5"
            specularConstant="0.75"
            specularExponent="20"
            lightingColor="white"
            result="specular"
          >
            <fePointLight x="-5000" y="-10000" z="20000" />
          </feSpecularLighting>
          <feComposite
            in="specular"
            in2="SourceAlpha"
            operator="in"
            result="specular-cropped"
          />
          <feComposite
            in="SourceGraphic"
            in2="specular-cropped"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
          />
        </filter>

        {/* Edge Glow Filter */}
        <filter id="glass-edge-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feMorphology in="SourceAlpha" operator="dilate" radius="1" result="dilated" />
          <feGaussianBlur in="dilated" stdDeviation="3" result="blurred" />
          <feFlood floodColor="white" floodOpacity="0.3" result="color" />
          <feComposite in="color" in2="blurred" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Frosted Glass Effect */}
        <filter id="frosted-glass" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 18 -7"
            result="contrast"
          />
          <feColorMatrix
            in="contrast"
            type="saturate"
            values="1.2"
          />
        </filter>

        {/* Liquid Drop Shadow */}
        <filter id="liquid-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0,0,0,0.15)" />
          <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="rgba(0,0,0,0.1)" />
        </filter>

        {/* Gradient definitions for glass effects */}
        <linearGradient id="glass-shine-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        <radialGradient id="glass-specular-gradient" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
    </svg>
  )
}

export default LiquidGlassFilters
