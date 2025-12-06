'use client'

import { Button } from "@/components/ui/button"
import { Download, Search, ChevronDown, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { items } from '../data/items'
import { track } from '@vercel/analytics'
import Particles from '../data/Particles'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCategories, setExpandedCategories] = useState([])
  const [expandedSubcategories, setExpandedSubcategories] = useState([])
  const [mounted, setMounted] = useState(false)

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(true)
  const [passwordError, setPasswordError] = useState("")

  const correctPassword = "arkadevelopments"

  // Mount + auth check
  useEffect(() => {
    setMounted(true)

    const authStatus = sessionStorage.getItem('authenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
      setShowPassword(false)
    }

    track('page_view', {
      page: 'home',
      authenticated: authStatus === 'true'
    })
  }, [])

  // Password submit
  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (password === correctPassword) {
      setIsAuthenticated(true)
      setShowPassword(false)
      sessionStorage.setItem('authenticated', 'true')
      track('login_success')
    } else {
      setPasswordError("Incorrect password")
      setTimeout(() => setPasswordError(""), 2000)
      track('login_failed')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setShowPassword(true)
    setPassword("")
    sessionStorage.removeItem('authenticated')
    track('logout')
  }

  // Filter + group items
  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = {}

    const sub = item.subcategory || "General"

    if (!acc[item.category][sub]) acc[item.category][sub] = []
    acc[item.category][sub].push(item)

    return acc
  }, {})

  // Auto expand on search
  useEffect(() => {
    if (!searchTerm) return

    const categories = Object.keys(groupedItems)
    setExpandedCategories(categories)

    const subs = new Set()
    categories.forEach(cat => {
      Object.keys(groupedItems[cat]).forEach(sub => {
        subs.add(`${cat}-${sub}`)
      })
    })

    setExpandedSubcategories([...subs])

    track('search', {
      search_term: searchTerm,
      results_count: filteredItems.length
    })
  }, [searchTerm])

  const toggleCategory = (category) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
    track('category_toggle')
  }

  const toggleSubcategory = (category, sub) => {
    const key = `${category}-${sub}`
    setExpandedSubcategories(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    )
    track('subcategory_toggle')
  }

  const handleDownload = (url, title) => {
    window.open(url, "_blank")
    track('download', { item_title: title })
  }

  const highlightText = (text, query) => {
    if (!query) return text

    const parts = text.split(new RegExp(`(${query})`, "gi"))
    return (
      <span>
        {parts.map((p, i) =>
          p.toLowerCase() === query.toLowerCase()
            ? <mark key={i} style={{ background: "#ffe08a" }}>{p}</mark>
            : <span key={i}>{p}</span>
        )}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-white">

      {/* PARTICLES BLOCK */}
      <div style={{ width: '100%', height: '600px', position: 'relative' }}>
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* PASSWORD OVERLAY */}
      {showPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
            <form onSubmit={handlePasswordSubmit} className="space-y-4">

              <h2 className="text-center text-xl font-semibold">
                Restricted Access
              </h2>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full border px-4 py-2 rounded-lg"
                autoFocus
              />

              {passwordError && (
                <div className="text-red-600 text-sm text-center">
                  {passwordError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg"
              >
                Unlock
              </button>

            </form>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      {!showPassword && (
        <div className="max-w-2xl mx-auto px-6 py-16">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-light">Storage Links</h1>

            <button
              onClick={handleLogout}
              className="px-3 py-1 border rounded-lg text-red-600"
            >
              Logout
            </button>
          </div>

          {/* SEARCH */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search items..."
                className="w-full pl-10 pr-4 py-2 border rounded-xl"
              />
            </div>
          </div>

          {/* LIST */}
          <main className="space-y-6">

            {Object.keys(groupedItems).length === 0 && (
              <p className="text-center text-gray-500">
                No items found matching "{searchTerm}"
              </p>
            )}

            {Object.entries(groupedItems).map(([category, subs]) => (
              <div key={category}>

                {/* CATEGORY HEADER */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="flex items-center gap-2 mb-3 text-lg"
                >
                  {expandedCategories.includes(category)
                    ? <ChevronDown className="h-4 w-4" />
                    : <ChevronRight className="h-4 w-4" />
                  }

                  <span>{category}</span>
                </button>

                {expandedCategories.includes(category) && (
                  <div className="ml-6 space-y-4">

                    {Object.entries(subs).map(([sub, list]) => {
                      const key = `${category}-${sub}`
                      const open = expandedSubcategories.includes(key)

                      return (
                        <div key={sub}>

                          {/* SUBCATEGORY HEADER */}
                          <button
                            onClick={() => toggleSubcategory(category, sub)}
                            className="flex items-center gap-2 mb-2"
                          >
                            {open
                              ? <ChevronDown className="h-3 w-3" />
                              : <ChevronRight className="h-3 w-3" />
                            }

                            <span>{sub} ({list.length})</span>
                          </button>

                          {/* ITEMS */}
                          {open && (
                            <div className="ml-6 space-y-2">

                              {list.map((item, i) => (
                                <div key={i} className="border rounded-lg p-3 flex justify-between">

                                  <div>{highlightText(item.title, searchTerm)}</div>

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDownload(item.downloadUrl, item.title)}
                                  >
                                    <Download className="h-3 w-3 mr-1" />
                                    Download
                                  </Button>

                                </div>
                              ))}

                            </div>
                          )}

                        </div>
                      )
                    })}

                  </div>
                )}

              </div>
            ))}

          </main>

        </div>
      )}

    </div>
  )
}
