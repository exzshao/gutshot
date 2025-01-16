'use client'

import NLPInput from '@/components/NLPInput'
import RangeInput from '@/components/RangeInput'
export default function Home() {
  return (
    <main className="min-h-screen w-full">
      <RangeInput />
      <NLPInput />
    </main>
  )
}


// export default function Home() {
//   const [data, setData] = useState(null)
//   const [clicked, setClicked] = useState(false)
//   useEffect(() => {
//     // Function to fetch data
//     const fetchData = async () => {
//       try {
//         const response = await fetch('/api/data', {  // Calling our route.ts endpoint
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             message: 'Hello from Next.js!',
//             timestamp: new Date().toISOString()
//           }),
//         })

//         const result = await response.json()
//         setData(result)
//       } catch (error) {
//         console.error('Error:', error)
//       }
//     }

//     fetchData()
//   }, [clicked, setClicked])

//   return (
//     <div className="p-4">
//       <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => { setClicked(!clicked)}}> Click </button>
//       <h1 className="text-2xl font-bold mb-4">Data Test</h1>
//       {data ? (
//         <pre className="bg-gray-100 p-4 rounded">
//           {JSON.stringify(data, null, 2)}
//         </pre>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   )
// }