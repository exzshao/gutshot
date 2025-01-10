import RangeInput from '@/components/RangeInput'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center">
          <h1 className="text-3xl font-semibold tracking-tight">Poker Range Analyzer</h1>
        </div>
      </header>
      <main className="container py-8">
        <div className="rounded-lg bg-card text-card-foreground">
          <RangeInput />
        </div>
      </main>
    </div>
  )
}

