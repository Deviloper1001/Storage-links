'use client'

import { Button } from "@/components/ui/button"
import { Download, Search, ChevronDown, ChevronRight, Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"
import { items, type StorageItem } from '../data/items'
import { track } from '@vercel/analytics';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(true)
  const [passwordError, setPasswordError] = useState("")

  // Simple password protection
  const correctPassword = "arkadevelopments"

  useEffect(() => {
    setMounted(true)
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true)
    }
    // Check if user was previously authenticated in this session
    const authStatus = sessionStorage.getItem('authenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
      setShowPassword(false)
    }
    
    // Track page view
    track('page_view', {
      page: 'home',
      authenticated: authStatus === 'true',
      theme: savedTheme || 'light',
      category: 'page_view'
    })
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
    
    // Track theme toggle
    track('theme_change', {
      theme: isDarkMode ? 'dark' : 'light',
      category: 'user_interaction'
    })
  }, [isDarkMode])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === correctPassword) {
      setIsAuthenticated(true)
      setShowPassword(false)
      setPasswordError("")
      sessionStorage.setItem('authenticated', 'true')
      // Track successful login
      track('login_success', {
        method: 'password',
        category: 'authentication'
      })
    } else {
      setPasswordError("Incorrect password")
      setTimeout(() => setPasswordError(""), 3000)
      // Track failed login
      track('login_failed', {
        error: 'incorrect_password',
        category: 'authentication'
      })
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setShowPassword(true)
    setPassword("")
    sessionStorage.removeItem('authenticated')
    
    // Track logout event
    track('logout', {
      category: 'authentication'
    })
  }

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = {}
    }
    
    // If item has subcategory, group by subcategory
    if (item.subcategory) {
      if (!acc[item.category][item.subcategory]) {
        acc[item.category][item.subcategory] = []
      }
      acc[item.category][item.subcategory].push(item)
    } else {
      // If no subcategory, group under "General"
      if (!acc[item.category]["General"]) {
        acc[item.category]["General"] = []
      }
      acc[item.category]["General"].push(item)
    }
    return acc
  }, {} as Record<string, Record<string, typeof items>>)

  // When searching, expand all categories that have matching items
  useEffect(() => {
    if (searchTerm) {
      const categoriesWithMatches = Object.keys(groupedItems)
      setExpandedCategories(categoriesWithMatches)
      // Also expand all subcategories with matches
      const subcategoriesWithMatches = new Set<string>()
      categoriesWithMatches.forEach(category => {
        Object.keys(groupedItems[category]).forEach(subcategory => {
          subcategoriesWithMatches.add(`${category}-${subcategory}`)
        })
      })
      setExpandedSubcategories(Array.from(subcategoriesWithMatches))
      
      // Track search event
      track('search', {
        search_term: searchTerm,
        results_count: filteredItems.length,
        categories_matched: categoriesWithMatches.length,
        category: 'search'
      })
    }
  }, [searchTerm, groupedItems])

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
    // Track category toggle
    track('category_toggle', {
      category_name: category,
      action: prev.includes(category) ? 'collapse' : 'expand',
      category: 'navigation'
    })
  }

  const toggleSubcategory = (category: string, subcategory: string) => {
    const key = `${category}-${subcategory}`
    setExpandedSubcategories(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    )
    // Track subcategory toggle
    track('subcategory_toggle', {
      category_name: category,
      subcategory_name: subcategory,
      action: prev.includes(key) ? 'collapse' : 'expand',
      category: 'navigation'
    })
  }

  const handleDownload = (url: string, title: string) => {
    window.open(url, '_blank')
    // Track download event
    track('download', {
      item_title: title,
      item_url: url,
      category: 'file_download'
    })
  }

  const highlightText = (text: string, highlight: string) => {
    if (!highlight) return text
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
    return (
      <span>
        {parts.map((part, index) => 
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={index} className={`${isDarkMode ? 'bg-amber-500/30 text-amber-300 border-b-2 border-amber-400' : 'bg-gradient-to-r from-amber-200 to-amber-300 text-amber-900'} px-1 rounded animate-pulse font-medium`}>{part}</mark>
          ) : (
            part
          )
        )}
      </span>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
      {/* Password Protection Overlay */}
      {showPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`w-full max-w-md mx-4 p-6 rounded-2xl shadow-2xl transition-all duration-300 transform ${
            mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              {/* Lock Icon */}
              <div className="flex justify-center mb-6">
                <div className={`p-3 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  <svg className={`h-8 w-8 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h6m-6 4h6m2-5H4a2 2 0 00-2 2v3a2 2 0 002 2h1m0 0V7a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2v-2a2 2 0 00-2-2z" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-6">
                <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                  🔐 Restricted Access
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mt-2`}>
                  Enter password to access storage links
                </p>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600 focus:ring-blue-500 focus:border-blue-500 text-slate-100 placeholder-slate-500' 
                      : 'bg-white border-slate-300 focus:ring-blue-400 focus:border-blue-400 text-slate-900 placeholder-slate-500'
                  }`}
                  autoFocus
                />
              </div>

              {/* Error Message */}
              {passwordError && (
                <div className={`p-3 rounded-lg text-sm text-center animate-pulse ${
                  isDarkMode ? 'bg-red-900/50 text-red-300 border border-red-500/30' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {passwordError}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                Unlock Access
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!showPassword && (
        <div className="max-w-2xl mx-auto px-6 py-16">
          {/* Header */}
          <header className={`mb-16 transition-all duration-700 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center justify-between mb-4">
              <h1 className={`text-3xl font-light ${isDarkMode ? 'text-slate-100' : 'text-slate-800'} animate-fade-in`}>Storage Links</h1>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-2 rounded-full transition-all duration-300 ${isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-white text-slate-600 hover:bg-slate-100'} shadow-md hover:shadow-lg transform hover:scale-105`}
                >
                  {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <button
                  onClick={handleLogout}
                  className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30' 
                      : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                  }`}
                >
                  Logout
                </button>
              </div>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} animate-fade-in-delay`}>Personal Download Links *Don't Use These*</p>
          </header>

          {/* Search */}
          <div className={`mb-8 transition-all duration-700 delay-100 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="relative group">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-all duration-300 ${isDarkMode ? 'text-slate-400 group-hover:text-blue-400 group-focus-within:text-blue-400' : 'text-slate-400 group-hover:text-blue-500 group-focus-within:text-blue-500'} ${searchTerm ? (isDarkMode ? 'text-blue-400' : 'text-blue-500') : ''}`} />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 hover:scale-[1.02] shadow-sm ${
                  isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-600 text-slate-100 placeholder-slate-500' 
                    : 'bg-white/80 border-slate-200 focus:ring-blue-400 focus:border-blue-400 hover:border-slate-300 text-slate-900 placeholder-slate-500'
                } backdrop-blur-sm`}
              />
            </div>
          </div>

          {/* Items List by Category */}
          <main className="space-y-8">
            {Object.keys(groupedItems).length > 0 ? (
              Object.entries(groupedItems).map(([category, subcategories], categoryIndex) => (
                <div 
                  key={category} 
                  className={`transition-all duration-700 transform ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                  style={{ transitionDelay: `${200 + categoryIndex * 100}ms` }}
                >
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category)}
                    className={`flex items-center gap-2 mb-4 text-left w-full group -mx-2 px-3 py-2 rounded-xl transition-all duration-200 ${
                      isDarkMode 
                        ? 'hover:bg-slate-800/50' 
                        : 'hover:bg-blue-50/50'
                    }`}
                  >
                    <div className="transition-transform duration-300">
                      {expandedCategories.includes(category) ? (
                        <ChevronDown className={`h-4 w-4 transition-colors duration-200 ${isDarkMode ? 'text-slate-400 group-hover:text-blue-400' : 'text-slate-500 group-hover:text-blue-600'}`} />
                      ) : (
                        <ChevronRight className={`h-4 w-4 transition-colors duration-200 ${isDarkMode ? 'text-slate-400 group-hover:text-blue-400' : 'text-slate-500 group-hover:text-blue-600'}`} />
                      )}
                    </div>
                    <h2 className={`text-lg font-medium transition-colors duration-200 ${isDarkMode ? 'text-slate-100 group-hover:text-blue-400' : 'text-slate-800 group-hover:text-blue-600'}`}>
                      {category} ({Object.values(subcategories).reduce((sum, sub) => sum + sub.length, 0)})
                    </h2>
                  </button>

                  {/* Subcategories */}
                  {expandedCategories.includes(category) && (
                    <div className="ml-6 space-y-6">
                      {Object.entries(subcategories).map(([subcategory, subcategoryItems], subcategoryIndex) => (
                        <div 
                          key={subcategory} 
                          className="transition-all duration-500"
                          style={{ transitionDelay: `${subcategoryIndex * 50}ms` }}
                        >
                          {/* Subcategory Header */}
                          <button
                            onClick={() => toggleSubcategory(category, subcategory)}
                            className={`flex items-center gap-2 mb-3 text-left w-full group -mx-1 px-2 py-1 rounded-lg transition-all duration-200 ${
                              isDarkMode 
                                ? 'hover:bg-slate-700/50' 
                                : 'hover:bg-slate-100/50'
                            }`}
                          >
                            <div className="transition-transform duration-300">
                              {expandedSubcategories.includes(`${category}-${subcategory}`) ? (
                                <ChevronDown className={`h-3 w-3 transition-colors duration-200 ${isDarkMode ? 'text-slate-500 group-hover:text-blue-300' : 'text-slate-400 group-hover:text-blue-500'}`} />
                              ) : (
                                <ChevronRight className={`h-3 w-3 transition-colors duration-200 ${isDarkMode ? 'text-slate-500 group-hover:text-blue-300' : 'text-slate-400 group-hover:text-blue-500'}`} />
                              )}
                            </div>
                            <h3 className={`text-base font-normal transition-colors duration-200 ${isDarkMode ? 'text-slate-200 group-hover:text-blue-300' : 'text-slate-600 group-hover:text-blue-500'}`}>
                              {subcategory} ({subcategoryItems.length})
                            </h3>
                          </button>

                          {/* Items in Subcategory */}
                          {expandedSubcategories.includes(`${category}-${subcategory}`) && (
                            <div className="ml-6 space-y-3">
                              {subcategoryItems.map((item, index) => (
                                <div 
                                  key={index} 
                                  className={`border rounded-xl p-3 transition-all duration-300 hover:translate-x-1 transform backdrop-blur-sm ${
                                    isDarkMode 
                                      ? 'border-slate-700/60 bg-slate-800/40 hover:bg-slate-700/40 hover:border-blue-500/40 hover:shadow-blue-500/10' 
                                      : 'border-slate-200/60 bg-white/60 hover:bg-blue-50/40 hover:border-blue-200/60 hover:shadow-md'
                                  } hover:shadow-md`}
                                  style={{ transitionDelay: `${index * 30}ms` }}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <h4 className={`text-base font-medium transition-colors duration-200 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                                        {highlightText(item.title, searchTerm)}
                                      </h4>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDownload(item.downloadUrl, item.title)}
                                      className={`transition-all duration-200 hover:scale-105 transform backdrop-blur-sm ${
                                        isDarkMode 
                                          ? 'border-blue-600 text-blue-400 hover:bg-blue-600/20 hover:border-blue-500 hover:text-blue-300 bg-slate-800/50' 
                                          : 'border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 hover:shadow-md bg-white/80'
                                      }`}
                                    >
                                      <Download className="h-3 w-3 mr-2 transition-transform duration-200 group-hover:translate-y-0.5" />
                                      Download
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className={`text-center py-8 transition-all duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                <p className={`animate-pulse ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>No items found matching "{searchTerm}"</p>
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className={`mt-16 pt-8 border-t transition-all duration-700 delay-300 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${
            isDarkMode ? 'border-slate-700/60' : 'border-slate-200/60'
          }`}>
            <p className={`text-sm text-center transition-colors duration-200 ${isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-700'}`}>Don't Download anything unless you know me</p>
          </footer>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.6s ease-out 0.2s both;
        }

        .delay-100 {
          transition-delay: 100ms;
        }

        .delay-300 {
          transition-delay: 300ms;
        }

        ${!isDarkMode ? `
          mark {
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            color: #78350f;
            font-weight: 500;
            box-shadow: 0 1px 3px rgba(251, 191, 36, 0.3);
          }
        ` : `
          mark {
            background: rgba(245, 158, 11, 0.3);
            color: #fcd34d;
            font-weight: 500;
            border-bottom: 2px solid #f59e0b;
          }
        `}
      `}</style>
    </div>
  )
}
