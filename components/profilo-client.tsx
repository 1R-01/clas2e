"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, MapPin, Edit2, Settings, LogOut, Phone, Calendar } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface ProfiloClientProps {
  user: any
  stats: any
  badges: any[]
}

export function ProfiloClient({ user, stats, badges }: ProfiloClientProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (confirm("Sei sicuro di voler effettuare il logout?")) {
      setIsLoggingOut(true)
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push("/auth/login")
      router.refresh()
    }
  }

  const getBadgeRarity = (badge: any) => {
    if (!badge.badge) return "common"
    const value = badge.badge.requirement_value
    if (value >= 100) return "legendary"
    if (value >= 50) return "epic"
    if (value >= 10) return "rare"
    return "common"
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
      case "epic":
        return "bg-purple-500/20 text-purple-700 dark:text-purple-400"
      case "rare":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-400"
      default:
        return "bg-gray-500/20 text-gray-700 dark:text-gray-400"
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Non specificato"
    return new Date(dateString).toLocaleDateString("it-IT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      year: "numeric",
      month: "long",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="p-8 mb-8 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex gap-6 items-start flex-1">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.avatar_url || user.full_name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1">
                <div className="flex gap-3 items-center mb-2">
                  <h1 className="text-3xl font-bold">{user.full_name || "Utente"}</h1>
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium capitalize">
                    {user.role || "student"}
                  </span>
                </div>
                {user.bio && <p className="text-foreground/70 mb-3">{user.bio}</p>}
                <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
                  {user.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </div>
                  )}
                  {user.city && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {user.city}
                    </div>
                  )}
                  {user.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {user.phone}
                    </div>
                  )}
                  {user.birth_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(user.birth_date)}
                    </div>
                  )}
                </div>
                {user.created_at && (
                  <p className="text-xs text-foreground/50 mt-2">Membro da {formatJoinDate(user.created_at)}</p>
                )}
              </div>
            </div>
            <div className="flex gap-3 flex-col sm:flex-row">
              <Link href="/utente/edit">
                <Button className="gap-2 bg-primary hover:bg-primary/90">
                  <Edit2 className="w-4 h-4" />
                  Modifica Profilo
                </Button>
              </Link>
              <Link href="/profilo/impostazioni">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Settings className="w-4 h-4" />
                  Impostazioni
                </Button>
              </Link>
              <Button
                variant="outline"
                className="gap-2 text-destructive hover:bg-destructive/10 bg-transparent"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="w-4 h-4" />
                {isLoggingOut ? "Uscita..." : "Logout"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats Row */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 text-center">
            <div className="text-2xl mb-2">📝</div>
            <div className="text-2xl font-bold text-primary mb-1">{stats.materials || 0}</div>
            <p className="text-sm text-foreground/60">Appunti Caricati</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-2xl mb-2">💬</div>
            <div className="text-2xl font-bold text-secondary mb-1">{stats.discussions || 0}</div>
            <p className="text-sm text-foreground/60">Discussioni</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-2xl mb-2">✍️</div>
            <div className="text-2xl font-bold text-primary mb-1">{stats.comments || 0}</div>
            <p className="text-sm text-foreground/60">Commenti</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-2xl mb-2">🎓</div>
            <div className="text-2xl font-bold text-secondary mb-1">{stats.quizzes || 0}</div>
            <p className="text-sm text-foreground/60">Quiz Completati</p>
          </Card>
        </div>

        {/* XP and Level Card */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">Livello {stats.level || 1}</h3>
              <p className="text-sm text-foreground/60">{stats.xp || 0} XP totali</p>
            </div>
            <div className="text-4xl">⭐</div>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all"
              style={{
                width: `${Math.min(((stats.xp || 0) % 500) / 5, 100)}%`,
              }}
            />
          </div>
          <p className="text-xs text-foreground/50 mt-2">{500 - ((stats.xp || 0) % 500)} XP al prossimo livello</p>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="badges" className="w-full">
          <TabsList className="grid w-full md:w-auto md:grid-cols-3 mb-6">
            <TabsTrigger value="badges">Badge ({badges.length})</TabsTrigger>
            <TabsTrigger value="activity">Attività</TabsTrigger>
            <TabsTrigger value="stats">Statistiche</TabsTrigger>
          </TabsList>

          {/* Badges Tab */}
          <TabsContent value="badges">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">I tuoi Badge</h2>
              {badges.length > 0 ? (
                <div className="grid md:grid-cols-4 gap-4">
                  {badges.map((userBadge: any) => {
                    const badge = userBadge.badge
                    const rarity = getBadgeRarity(userBadge)
                    return (
                      <Card
                        key={userBadge.id}
                        className="p-6 text-center border-2 border-primary/20 hover:border-primary/50 transition"
                      >
                        <div className="text-4xl mb-3">{badge.icon_url || "🏆"}</div>
                        <h3 className="font-semibold mb-2">{badge.name}</h3>
                        <p className="text-xs text-foreground/60 mb-2">{badge.description}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${getRarityColor(rarity)}`}>{rarity}</span>
                        {userBadge.earned_at && (
                          <p className="text-xs text-foreground/50 mt-2">
                            Ottenuto il {formatDate(userBadge.earned_at)}
                          </p>
                        )}
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏆</div>
                  <p className="text-foreground/60 mb-4">Nessun badge ancora</p>
                  <p className="text-sm text-foreground/50">Continua a contribuire per sbloccare i tuoi primi badge!</p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Attività Recente</h2>
              <div className="text-center py-12">
                <p className="text-foreground/60">Funzionalità in arrivo</p>
              </div>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Statistiche Dettagliate</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Contributi Totali</span>
                    <span className="text-primary font-bold">{stats.totalContributions || 0}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${Math.min((stats.totalContributions || 0) * 2, 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Giorni Attivi Consecutivi</span>
                    <span className="text-secondary font-bold">{stats.streak || 0} giorni</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-secondary h-2 rounded-full"
                      style={{ width: `${Math.min((stats.streak || 0) * 10, 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Giorni Attivi Totali</span>
                    <span className="text-primary font-bold">{stats.totalActiveDays || 0} giorni</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${Math.min((stats.totalActiveDays || 0) * 3, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
