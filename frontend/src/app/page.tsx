'use client'

import NLPInput from '@/components/NLPInput'
import RangeInput from '@/components/RangeInput'
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [messageRes, setMessageRes] = useState<string | null>(null);
  const handleMessageReturn = (data: string) => {
    setMessageRes(data);
  }
  useEffect(() => {
    console.log("Updated messageRes: ", messageRes);
  }, [messageRes]);
  return (
    <main className="min-h-screen w-full">
      <div style={{ transform: 'scale(0.66)', transformOrigin: 'top center' }}>
        <RangeInput />
        <NLPInput onMessageReturn={(data: string) => {handleMessageReturn(data)}}/>
        <div> 
          {messageRes ? <h1>{messageRes}</h1> : null}
        </div>
      </div>
    </main>
  )
}