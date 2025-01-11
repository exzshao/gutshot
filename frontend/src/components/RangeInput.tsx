"use client"

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

type Hand = string
type Range = Set<Hand>

const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']

const PokerGrid: React.FC<{
  range: Range
  setRange: React.Dispatch<React.SetStateAction<Range>>
  title: string
}> = ({ range, setRange, title }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isAdding, setIsAdding] = useState(true)
  const lastToggledRef = useRef<string | null>(null)

  const toggleHand = useCallback((hand: Hand, forceAdd: boolean | null = null) => {
    setRange(prev => {
      const newRange = new Set(prev)
      const shouldAdd = forceAdd !== null ? forceAdd : !newRange.has(hand)
      if (shouldAdd) {
        newRange.add(hand)
      } else {
        newRange.delete(hand)
      }
      return newRange
    })
  }, [setRange])

  const handleMouseDown = (e: React.MouseEvent, hand: Hand) => {
    e.preventDefault()
    setIsDragging(true)
    setIsAdding(!range.has(hand))
    toggleHand(hand)
    lastToggledRef.current = hand
  }

  const handleMouseEnter = (hand: Hand) => {
    if (isDragging && lastToggledRef.current !== hand) {
      toggleHand(hand, isAdding)
      lastToggledRef.current = hand
    }
  }

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    lastToggledRef.current = null
  }, [])

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp)
    return () => window.removeEventListener('mouseup', handleMouseUp)
  }, [handleMouseUp])

  return (
    <div>
      <div className="flex justify-between items-baseline mb-6">
        <h2 className="text-2xl font-normal">{title}</h2>
        <button 
          onClick={() => setRange(new Set())}
          className="text-gray-500 hover:text-black transition-colors"
        >
          Clear
        </button>
      </div>
      <div className="grid grid-cols-[2rem_repeat(13,2rem)] gap-px bg-gray-100 p-px w-fit">
        <div className="h-8" />
        {ranks.map(rank => (
          <div key={rank} className="flex items-center justify-center h-8 bg-white text-sm">
            {rank}
          </div>
        ))}

        {ranks.map((rowRank, i) => (
          <React.Fragment key={rowRank}>
            <div className="flex items-center justify-center h-8 bg-white text-sm">
              {rowRank}
            </div>
            {ranks.map((colRank, j) => {
              const hand = i <= j 
                ? `${rowRank}${colRank}${i === j ? '' : 's'}`
                : `${colRank}${rowRank}o`
              
              return (
                <div
                  key={`${rowRank}${colRank}`}
                  className={`
                    flex items-center justify-center h-8 text-xs cursor-pointer
                    transition-colors
                    ${range.has(hand) 
                      ? 'bg-black text-white' 
                      : i === j
                        ? 'bg-gray-100 hover:bg-gray-200'
                        : 'bg-white hover:bg-gray-50'
                    }
                  `}
                  onMouseDown={(e) => handleMouseDown(e, hand)}
                  onMouseEnter={() => handleMouseEnter(hand)}
                >
                  {hand}
                </div>
              )
            })}
          </React.Fragment>
        ))}
      </div>
      <p className="text-sm text-gray-500 mt-2">
        {((range.size / 169) * 100).toFixed(1)}% of hands selected
      </p>
    </div>
  )
}

export default function RangeInput() {
  const [ipRange, setIpRange] = useState<Range>(new Set())
  const [oopRange, setOopRange] = useState<Range>(new Set())
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const currentRanges = {
      inPosition: Array.from(ipRange),
      outOfPosition: Array.from(oopRange)
    }
    console.log('Current Ranges:', currentRanges)
    // Here you can send the currentRanges to your backend or make it available to other parts of your application
    // Example: sendToBackend(currentRanges)
  }, [ipRange, oopRange])

  return (
    <div className="p-8 max-w-[calc((2rem*14+13px)*2 + 4rem)] mx-auto flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-normal inline-block mr-4">Range Builder</h1>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="inline-flex items-center justify-center w-8 h-8 text-gray-500 hover:text-black transition-colors"
          aria-label={isCollapsed ? "Expand range builder" : "Collapse range builder"}
        >
          <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>
      <div 
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[2000px] opacity-100'}
        `}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 w-full lg:w-auto justify-center items-start">
          <PokerGrid 
            range={ipRange} 
            setRange={setIpRange} 
            title="In Position" 
          />
          <PokerGrid 
            range={oopRange} 
            setRange={setOopRange} 
            title="Out of Position" 
          />
        </div>
      </div>
    </div>
  )
}

