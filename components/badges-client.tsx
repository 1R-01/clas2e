"use client"

import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Award, Lock, CheckCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Badge {
  id: string
  name: string
  description: string
  icon_url: string | null
  requirement_type: string
  requirement_value: number
}

interface EarnedBadge {
  id: string
  earned_at: string
  badge: Badge
}

interface BadgesClientProps {
  allBadges: Badge[]
  earnedBadges: EarnedBadge[]
}

export function BadgesClient({ allBadges, earnedBadges }: BadgesClientProps) {
  const earnedBadgeIds = new Set(earnedBadges.map((eb) => eb.badge.id))
  const lockedBadges = allBadges.filter((b) => !earnedBadgeIds.has(b.id))

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-500" />
            Sistema Badge
          </h1>
          <p className="text-foreground/60">Sblocca badge completando attività e raggiungendo traguardi</p>

          <Card className="mt-4 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60">Badge Sbloccati</p>
                <p className="text-2xl font-bold text-amber-600">
                  {earnedBadges.length} / {allBadges.length}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-foreground/60">Progresso</p>
                <p className="text-2xl font-bold text-amber-600">
                  {Math.round((earnedBadges.length / allBadges.length) * 100)}%
                </p>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-3">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all"
                style={{ width: `${(earnedBadges.length / allBadges.length) * 100}%` }}
              />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="earned" className="w-full">
          <TabsList className="grid w-full md:w-auto md:grid-cols-3 mb-6">
            <TabsTrigger value="earned">Sbloccati ({earnedBadges.length})</TabsTrigger>
            <TabsTrigger value="locked">Bloccati ({lockedBadges.length})</TabsTrigger>
            <TabsTrigger value="all">Tutti ({allBadges.length})</TabsTrigger>
          </TabsList>

          {/* Earned Badges */}
          <TabsContent value="earned">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Badge Sbloccati</h2>
              {earnedBadges.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-4">
                  {earnedBadges.map((eb) => (
                    <div
                      key={eb.id}
                      className="p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-2 border-amber-500/30 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-5xl">{eb.badge.icon_url || "🏆"}</div>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <h3 className="font-bold text-lg mb-1">{eb.badge.name}</h3>
                      <p className="text-sm text-foreground/60 mb-3">{eb.badge.description}</p>
                      <p className="text-xs text-foreground/50">
                        Sbloccato: {new Date(eb.earned_at).toLocaleDateString("it-IT")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-foreground/60 py-8">
                  Nessun badge sbloccato ancora. Inizia a contribuire!
                </p>
              )}
            </Card>
          </TabsContent>

          {/* Locked Badges */}
          <TabsContent value="locked">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Badge da Sbloccare</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {lockedBadges.map((badge) => (
                  <div key={badge.id} className="p-6 bg-muted/30 border-2 border-border rounded-lg opacity-60">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-5xl grayscale">{badge.icon_url || "🏆"}</div>
                      <Lock className="w-5 h-5 text-foreground/40" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">{badge.name}</h3>
                    <p className="text-sm text-foreground/60 mb-3">{badge.description}</p>
                    <p className="text-xs text-foreground/50">
                      Requisito: {badge.requirement_value} {badge.requirement_type}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* All Badges */}
          <TabsContent value="all">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Tutti i Badge</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {allBadges.map((badge) => {
                  const isEarned = earnedBadgeIds.has(badge.id)
                  const earnedBadge = earnedBadges.find((eb) => eb.badge.id === badge.id)

                  return (
                    <div
                      key={badge.id}
                      className={`p-6 border-2 rounded-lg ${
                        isEarned
                          ? "bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30"
                          : "bg-muted/30 border-border opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`text-5xl ${!isEarned && "grayscale"}`}>{badge.icon_url || "🏆"}</div>
                        {isEarned ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Lock className="w-5 h-5 text-foreground/40" />
                        )}
                      </div>
                      <h3 className="font-bold text-lg mb-1">{badge.name}</h3>
                      <p className="text-sm text-foreground/60 mb-3">{badge.description}</p>
                      {isEarned && earnedBadge ? (
                        <p className="text-xs text-foreground/50">
                          Sbloccato: {new Date(earnedBadge.earned_at).toLocaleDateString("it-IT")}
                        </p>
                      ) : (
                        <p className="text-xs text-foreground/50">
                          Requisito: {badge.requirement_value} {badge.requirement_type}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
