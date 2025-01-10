"use client"

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Sun, Moon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { useTheme } from "next-themes"

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
    setRange((prevRange: Range) => {
      const newRange = new Set(prevRange) as Range
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
    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseUp])

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setRange(new Set())}
          className="text-xs"
        >
          Clear All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Slider
            defaultValue={[0]}
            max={100}
            step={1}
            value={[((range.size / 169) * 100)]}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground mt-2">
            {((range.size / 169) * 100).toFixed(1)}% picked
          </p>
        </div>
        <div 
          className="grid grid-cols-[auto_repeat(13,minmax(0,1fr))] rounded-lg overflow-hidden select-none gap-px bg-background p-1 w-full max-w-fit mx-auto"
          onMouseLeave={() => {
            if (isDragging) {
              setIsDragging(false)
              lastToggledRef.current = null
            }
          }}
        >
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-sm bg-muted flex items-center justify-center" />
          {ranks.map((rank) => (
            <div key={rank} className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-sm bg-muted text-muted-foreground text-[10px] sm:text-xs font-medium">
              {rank}
            </div>
          ))}

          {ranks.map((rowRank, i) => (
            <React.Fragment key={rowRank}>
              <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-sm bg-muted text-muted-foreground text-[10px] sm:text-xs font-medium">
                {rowRank}
              </div>
              
              {ranks.map((colRank, j) => {
                const hand = i <= j 
                  ? `${rowRank}${colRank}${i === j ? '' : 's'}`
                  : `${colRank}${rowRank}o`
                
                const isSelected = range.has(hand)
                
                return (
                  <motion.div
                    key={`${rowRank}${colRank}`}
                    className={`
                      w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-[8px] sm:text-[10px] cursor-pointer
                      rounded-sm transition-all duration-200 font-medium
                      ${isSelected ? 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100' : 
                        i === j ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' :
                        i < j ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-100 hover:bg-emerald-200 dark:hover:bg-emerald-900' :
                        'bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-100 hover:bg-amber-200 dark:hover:bg-amber-900'
                      }
                    `}
                    onMouseDown={(e) => handleMouseDown(e, hand)}
                    onMouseEnter={() => handleMouseEnter(hand)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {hand}
                  </motion.div>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const RangeInput: React.FC = () => {
  const [ipRange, setIpRange] = useState<Range>(new Set())
  const [oopRange, setOopRange] = useState<Range>(new Set())
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="w-full px-2 sm:px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">Pick Your Hands</h2>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(prev => !prev)}>
              <ChevronDown
                className={`h-6 w-6 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`}
              />
            </Button>
          </div>
        </div>
        
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
                <div className="w-full md:w-1/2">
                  <PokerGrid 
                    range={ipRange}
                    setRange={setIpRange}
                    title="In Position"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <PokerGrid 
                    range={oopRange}
                    setRange={setOopRange}
                    title="Out of Position"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default RangeInput

