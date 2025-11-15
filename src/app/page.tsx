'use client'

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

const games = [
  { title: "Grand Theft Auto 4",
    downloadUrl:"https://1024terabox.com/s/113nEu5yfDNSO3V7bnW535w",
  },  
  { 
    title: "Grand Theft Auto: San Andreas",
    downloadUrl: "https://1024terabox.com/s/1rFMGbIqxxNWUYcFTnZoWOA",
  },
  {
    title: "Grand Theft Auto: Vice City",
    downloadUrl: "https://1024terabox.com/s/1nhru16Sn5AfBAF0VGjxSUg",
  },
  {
    title: "BeamNG.drive",
    downloadUrl: "https://1024terabox.com/s/1JL5lDWTRIY85QBbkD6k7fg",
  },
  {
    title: "Getting Over It",
    downloadUrl: "https://1024terabox.com/s/19ioNoy8tywEfrbiGKv1K5w",
  }
]

export default function Home() {
  const handleDownload = (url: string, title: string) => {
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="mb-16">
          <h1 className="text-2xl font-light text-gray-900 mb-2">FunDen</h1>
          <p className="text-sm text-gray-600">Free game downloads</p>
        </header>

        {/* Games List */}
        <main className="space-y-8">
          {games.map((game, index) => (
            <div key={index} className="border-b border-gray-200 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{game.title}</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(game.downloadUrl, game.title)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </main>

        {/* Footer */}
        <footer className="mt-15 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">Have fun</p>
        </footer>
      </div>
    </div>
  )
}
