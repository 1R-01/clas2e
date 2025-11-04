"use client"

import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { BookOpen, HelpCircle, Lightbulb } from "lucide-react"

export default function GuidaPage() {
  const guides = [
    {
      title: "Come utilizzare gli Esercizi",
      icon: BookOpen,
      content: "Scopri come accedere, risolvere e condividere gli esercizi con i tuoi compagni.",
    },
    {
      title: "Partecipare alle Discussioni",
      icon: HelpCircle,
      content: "Impara come creare discussioni, rispondere e collaborare nel forum.",
    },
    {
      title: "Guadagnare XP e Badge",
      icon: Lightbulb,
      content: "Scopri come il sistema di gamification ti aiuta a motivarti e competere.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">Guida del Portale</h1>
        <p className="text-foreground/70 mb-12 text-lg">
          Benvenuto! Qui troverai tutte le informazioni di cui hai bisogno per usare al meglio il portale.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {guides.map((guide, idx) => {
            const Icon = guide.icon
            return (
              <Card key={idx} className="p-6 hover:shadow-lg transition-all">
                <Icon className="w-12 h-12 text-primary mb-4" />
                <h2 className="text-xl font-bold mb-3">{guide.title}</h2>
                <p className="text-foreground/70">{guide.content}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
