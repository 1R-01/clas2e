"use client"

import { useState, useCallback, memo } from "react"
import Link from "next/link"
import { Search, Bell, User, Menu, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

const searchableContent = [
  { title: "Quiz di Matematica - Equazioni", href: "/quiz", category: "Quiz" },
  { title: "Quiz Matematica Settimanale", href: "/quiz", category: "Quiz" },
  { title: "Quiz Fisica - Cinematica", href: "/quiz", category: "Quiz" },
  { title: "Quiz Biologia - Cellula", href: "/quiz", category: "Quiz" },
  { title: "Quiz di Matematica - Frazioni", href: "/quiz", category: "Quiz" },
  { title: "Quiz Fisica - Termodinamica", href: "/quiz", category: "Quiz" },
  { title: "Quiz Biologia - Evoluzione", href: "/quiz", category: "Quiz" },
  { title: "Esercizio Equazioni di Primo Grado", href: "/esercizi", category: "Esercizio" },
  { title: "Fotosintesi e Respirazione", href: "/appunti", category: "Appunto" },
  { title: "Progetto Robotica - Mars Rover", href: "/progetti", category: "Progetto" },
  { title: "Come preparare la relazione?", href: "/forum", category: "Discussione" },
  { title: "Analisi Dante", href: "/progetti", category: "Progetto" },
  { title: "Energia Rinnovabile", href: "/progetti", category: "Progetto" },
]

export const Navbar = memo(function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<typeof searchableContent>([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    if (query.trim().length > 0) {
      const results = searchableContent.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()),
      )
      setSearchResults(results)
      setShowSearchResults(true)
    } else {
      setShowSearchResults(false)
    }
  }, [])

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 font-bold text-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-primary-foreground">
              📚
            </div>
            <span className="hidden sm:inline">Classe 1R</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground/70 hover:text-foreground transition">
              Inizio
            </Link>
            <Link href="/esercizi" className="text-foreground/70 hover:text-foreground transition">
              Esercizi
            </Link>
            <Link href="/appunti" className="text-foreground/70 hover:text-foreground transition">
              Appunti
            </Link>
            <Link href="/forum" className="text-foreground/70 hover:text-foreground transition">
              Forum
            </Link>
            <Link href="/progetti" className="text-foreground/70 hover:text-foreground transition">
              Progetti
            </Link>
            <Link href="/ai" className="text-foreground/70 hover:text-foreground transition flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              IA
            </Link>
          </div>

          {/* Search and Icons */}
          <div className="flex items-center gap-4 relative">
            <div className="hidden sm:flex items-center gap-2 bg-muted rounded-lg px-3 py-2 relative">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cerca..."
                className="bg-transparent outline-none text-sm w-32 placeholder-muted-foreground"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery && setShowSearchResults(true)}
              />
              {showSearchResults && searchResults.length > 0 && (
                <Card className="absolute top-full left-0 mt-2 w-80 p-2 z-50 bg-card border border-border shadow-lg">
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {searchResults.map((result, idx) => (
                      <Link
                        key={idx}
                        href={result.href}
                        onClick={() => {
                          setSearchQuery("")
                          setShowSearchResults(false)
                        }}
                        className="block p-2 rounded hover:bg-muted transition text-sm"
                      >
                        <div className="font-medium text-foreground">{result.title}</div>
                        <div className="text-xs text-foreground/60">{result.category}</div>
                      </Link>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            <ThemeToggle />

            <Link href="/notifiche">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
              </Button>
            </Link>

            <Link href="/profilo">
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            <Link href="/" className="block py-2 text-foreground/70 hover:text-foreground">
              Inizio
            </Link>
            <Link href="/esercizi" className="block py-2 text-foreground/70 hover:text-foreground">
              Esercizi
            </Link>
            <Link href="/appunti" className="block py-2 text-foreground/70 hover:text-foreground">
              Appunti
            </Link>
            <Link href="/forum" className="block py-2 text-foreground/70 hover:text-foreground">
              Forum
            </Link>
            <Link href="/progetti" className="block py-2 text-foreground/70 hover:text-foreground">
              Progetti
            </Link>
            <Link href="/ai" className="block py-2 text-foreground/70 hover:text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Assistente IA
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
})
