// import NLPInput from '@/components/NLPInput'
// import RangeInput from '@/components/RangeInput'

// export default function Home() {
//   return (
//     <main className="min-h-screen w-full">
//       <RangeInput />
//       <NLPInput />
//     </main>
//   )
// }

'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [data, setData] = useState(null)

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data', {  // Calling our route.ts endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: 'Hello from Next.js!',
            timestamp: new Date().toISOString()
          }),
        })

        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Data Test</h1>
      {data ? (
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}