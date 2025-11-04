"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, ThumbsUp, Eye, Clock, User, Plus, Search } from "lucide-react"

const categories = [
  { id: 1, name: "Matematica", color: "from-blue-500 to-cyan-500", threads: 45 },
  { id: 2, name: "Fisica", color: "from-purple-500 to-pink-500", threads: 38 },
  { id: 3, name: "Biologia", color: "from-green-500 to-teal-500", threads: 32 },
  { id: 4, name: "Progetti", color: "from-orange-500 to-red-500", threads: 28 },
  { id: 5, name: "Generale", color: "from-indigo-500 to-blue-500", threads: 67 },
]

const discussions = [
  {
    id: 1,
    title: "Come preparare la relazione di laboratorio?",
    category: "Fisica",
    author: "Maria G.",
    avatar: "👩‍💼",
    date: "4 ore fa",
    replies: 8,
    views: 124,
    likes: 12,
    content: "Ho alcuni dubbi sulla struttura della relazione di laboratorio. Quale è il formato corretto?",
    latest_reply: "Marco L.: Dipende dall'insegnante, ma generalmente serve: Obiettivo, Materiali, Procedura...",
  },
  {
    id: 2,
    title: "Qualcuno mi spiega le equazioni parametriche?",
    category: "Matematica",
    author: "Luca M.",
    avatar: "👨‍💻",
    date: "8 ore fa",
    replies: 15,
    views: 289,
    likes: 28,
    content: "Non riesco a capire il concetto di parametrizzazione delle curve. Potete fare un esempio?",
    latest_reply: "Prof. Rossi: Una curva parametrica è definita da x=f(t) e y=g(t)...",
  },
  {
    id: 3,
    title: "Risultati del test di biologia",
    category: "Biologia",
    author: "Sofia R.",
    avatar: "👩‍🎓",
    date: "1 giorno fa",
    replies: 23,
    views: 456,
    likes: 45,
    content: "Ciao! Come vi è andato il test di ieri sulla cellula? Quale domanda vi ha dato più problemi?",
    latest_reply: "Andrea B.: La domanda sulla osmosi mi ha confuso, ma ora ho capito meglio!",
  },
  {
    id: 4,
    title: "Progetto Robotica - Cerchiamo nuovo membro",
    category: "Progetti",
    author: "Team Robotica",
    avatar: "🤖",
    date: "2 giorni fa",
    replies: 6,
    views: 182,
    likes: 34,
    content: "Il nostro team di robotica sta cercando un bravo programmatore per completare il progetto. Interessati?",
    latest_reply: "Marco L.: Sono disponibile! Mi dite di cosa avete bisogno?",
  },
  {
    id: 5,
    title: "Consigli per studiare meglio",
    category: "Generale",
    author: "Prof. Verdi",
    avatar: "🧑‍🏫",
    date: "3 giorni fa",
    replies: 12,
    views: 398,
    likes: 67,
    content: "Condividiamo le nostre strategie di studio più efficaci. Cosa funziona meglio per voi?",
    latest_reply: "Sofia R.: Io uso la tecnica del Pomodoro: 25 min di studio, poi 5 min di pausa.",
  },
]

export default function ForumPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [liked, setLiked] = useState<number[]>([])

  const filteredDiscussions = discussions.filter((discussion) => {
    const matchSearch = discussion.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCategory = !selectedCategory || discussion.category === selectedCategory
    return matchSearch && matchCategory
  })

  const toggleLike = (id: number) => {
    setLiked((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Forum e Discussioni</h1>
            <p className="text-foreground/60">Condividi dubbi, domande e consigli con i compagni</p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            Nuova Discussione
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
          <input
            type="text"
            placeholder="Cerca discussioni..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20">
              <h3 className="font-bold mb-4">Categorie</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-4 py-3 rounded transition ${
                    selectedCategory === null ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Tutte</span>
                    <span className="text-xs bg-primary/20 px-2 py-1 rounded">{discussions.length}</span>
                  </div>
                </button>

                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full text-left px-4 py-3 rounded transition ${
                      selectedCategory === category.name ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-xs bg-primary/20 px-2 py-1 rounded">{category.threads}</span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Discussions List */}
          <div className="lg:col-span-3 space-y-4">
            {filteredDiscussions.map((discussion) => (
              <Card
                key={discussion.id}
                className="p-6 hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-secondary"
              >
                {/* Header */}
                <div className="flex gap-4 mb-4">
                  <div className="text-3xl">{discussion.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3
                          className="text-lg font-bold hover:text-primary transition"
                          onClick={() => setExpandedId(expandedId === discussion.id ? null : discussion.id)}
                        >
                          {discussion.title}
                        </h3>
                        <div className="flex gap-3 text-sm text-foreground/60 mt-1">
                          <span className="bg-primary/10 px-2 py-1 rounded">{discussion.category}</span>
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {discussion.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {discussion.date}
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-xs text-foreground/60">
                        <div className="flex gap-3">
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {discussion.replies}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {discussion.views}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Preview */}
                <div className="bg-muted/50 p-4 rounded-lg mb-4">
                  <p className="text-foreground/80 text-sm">{discussion.content}</p>
                </div>

                {/* Comments Section */}
                {expandedId === discussion.id && (
                  <div className="space-y-4 mb-4">
                    <h4 className="font-bold text-foreground text-sm">Commenti Recenti:</h4>
                    <div className="space-y-3 bg-secondary/5 p-4 rounded-lg border border-secondary/10 max-h-48 overflow-y-auto">
                      <div className="flex gap-3">
                        <span className="text-xl">👨‍💻</span>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">
                            Marco L. <span className="text-xs text-foreground/60">3 ore fa</span>
                          </p>
                          <p className="text-sm text-foreground/70">{discussion.latest_reply}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-xl">👩‍💼</span>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">
                            Anna M. <span className="text-xs text-foreground/60">1 ora fa</span>
                          </p>
                          <p className="text-sm text-foreground/70">Io concordo, molto utile questa discussione!</p>
                        </div>
                      </div>
                    </div>
                    {/* Comment Input Form */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Aggiungi un commento..."
                        className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Rispondi
                      </Button>
                    </div>
                  </div>
                )}

                {/* Latest Reply */}
                {expandedId === discussion.id && (
                  <div className="bg-secondary/10 p-4 rounded-lg mb-4 border border-secondary/20">
                    <p className="text-xs font-semibold text-secondary mb-2">Risposta Principale:</p>
                    <p className="text-sm text-foreground/80">{discussion.latest_reply}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between text-foreground/60">
                  <div className="flex gap-4">
                    <button
                      onClick={() => toggleLike(discussion.id)}
                      className="flex items-center gap-2 hover:text-primary transition"
                    >
                      <ThumbsUp className="w-5 h-5" fill={liked.includes(discussion.id) ? "currentColor" : "none"} />
                      <span>{discussion.likes + (liked.includes(discussion.id) ? 1 : 0)}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-secondary transition">
                      <MessageCircle className="w-5 h-5" />
                      <span>Rispondi</span>
                    </button>
                  </div>
                  <a href={`/forum/${discussion.id}`} className="text-primary hover:underline text-sm">
                    Vedi discussione
                  </a>
                </div>
              </Card>
            ))}

            {filteredDiscussions.length === 0 && (
              <Card className="p-12 text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-foreground/30" />
                <p className="text-foreground/60">Nessuna discussione trovata</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
