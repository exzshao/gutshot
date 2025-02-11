'use client'

import { useState, FormEvent, useRef, useEffect } from 'react'
import { ArrowRightIcon as ArrowReturn } from 'lucide-react'
import { sendChat } from '@/app/api'

interface NaturalLanguageInputProps{
  onMessageReturn: (data: string) => void
}

export default function NaturalLanguageInput({ onMessageReturn }: NaturalLanguageInputProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const temp = input
    setInput('')
    try{
      const res = await sendChat(temp)
      onMessageReturn(res.response)
      console.log('Chat Response:', res)
    } catch (error) {
      console.error('Chat Error:', error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full p-8 bg-background">
      <div className="w-full max-w-4xl space-y-8">
        <h1 className="text-7xl text-black font-bold tracking-normal text-center font-sans max-w-4xl mx-auto mb-8">
          Describe your action.
        </h1>
        <form onSubmit={handleSubmit} className="relative w-full">
          <input
            ref={inputRef}
            type="text"
            placeholder="Flop comes Qs 7d 2h. Villain checks. What do I do here?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-16 text-2xl px-6 rounded-xl bg-background font-sans border-none shadow-none focus:outline-none focus:ring-0 focus:border-transparent focus:bg-gray-100 transition-colors duration-200 placeholder-gray-400 placeholder:text-2xl"
          />
          <button
            type="submit"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Submit"
          >
            <ArrowReturn size={32} />
          </button>
        </form>
      </div>
    </div>
  )
}

