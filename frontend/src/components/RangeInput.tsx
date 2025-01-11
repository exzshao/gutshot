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
  onRangeChange: (range: Range) => void
}> = ({ range, setRange, title, onRangeChange }) => {
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
      onRangeChange(newRange)
      return newRange
    })
  }, [setRange, onRangeChange])

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
      <div className="flex justify-between items-baseline mb-8">
        <h2 className="text-3xl font-normal">{title}</h2>
        <button 
          onClick={() => {
            setRange(new Set())
            onRangeChange(new Set())
          }}
          className="text-gray-500 hover:text-black transition-colors text-xl"
        >
          Clear
        </button>
      </div>
      <div className="grid grid-cols-[2.5rem_repeat(13,2.5rem)] gap-px bg-gray-100 p-px w-fit">
        <div className="h-10" />
        {ranks.map(rank => (
          <div key={rank} className="flex items-center justify-center h-10 bg-white text-base font-medium">
            {rank}
          </div>
        ))}

        {ranks.map((rowRank, i) => (
          <React.Fragment key={rowRank}>
            <div className="flex items-center justify-center h-10 bg-white text-base font-medium">
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
                    flex items-center justify-center h-10 text-sm cursor-pointer
                    transition-colors
                    ${range.has(hand) 
                      ? 'bg-black text-white' 
                      : i === j
                        ? 'bg-gray-70 hover:bg-gray-200 text-gray-500'
                        : 'bg-white hover:bg-gray-50 text-gray-500'
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
      <p className="text-base text-gray-500 mt-4">
        {((range.size / 169) * 100).toFixed(1)}% of hands selected
      </p>
    </div>
  )
}

export default function RangeInput() {
  const [ipRange, setIpRange] = useState<Range>(new Set())
  const [oopRange, setOopRange] = useState<Range>(new Set())
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [currentRanges, setCurrentRanges] = useState({
    inPosition: [] as string[],
    outOfPosition: [] as string[]
  })

  const updateCurrentRanges = useCallback((position: 'inPosition' | 'outOfPosition', range: Range) => {
    setCurrentRanges(prev => ({
      ...prev,
      [position]: Array.from(range)
    }))
  }, [])

  useEffect(() => {
    console.log('Current Ranges:', currentRanges)
    // Example: sendToBackend(currentRanges)
  }, [currentRanges])

  return (
    <div className="p-12 max-w-[calc((2.5rem*14+13px)*2 + 6rem)] mx-auto flex flex-col items-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-normal inline-block mr-6">Range Builder</h1>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="inline-flex items-center justify-center w-10 h-10 text-gray-500 hover:text-black transition-colors"
          aria-label={isCollapsed ? "Expand range builder" : "Collapse range builder"}
        >
          <ChevronDown className={`w-8 h-8 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>
      <div 
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[2400px] opacity-100'}
        `}
      >
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-24 w-full xl:w-auto justify-center items-start">
          <PokerGrid 
            range={ipRange} 
            setRange={setIpRange} 
            title="In Position" 
            onRangeChange={(range) => updateCurrentRanges('inPosition', range)}
          />
          <PokerGrid 
            range={oopRange} 
            setRange={setOopRange} 
            title="Out of Position" 
            onRangeChange={(range) => updateCurrentRanges('outOfPosition', range)}
          />
        </div>
      </div>
    </div>
  )
}

