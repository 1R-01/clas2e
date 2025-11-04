"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Calendar, CheckCircle, AlertCircle, Plus, MessageCircle, Eye } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import Link from "next/link"

const projects = [
  {
    id: 1,
    title: "Progetto Robotica - Mars Rover",
    description: "Costruzione di un rover autonomo con sistema di navigazione basato su sensori",
    status: "In Corso",
    progress: 65,
    members: ["Marco L.", "Sofia R.", "Andrea B.", "Luca M."],
    deadline: "2025-03-15",
    category: "Progetto Tecnico",
    timeline: [
      { milestone: "Progettazione", date: "2024-12-15", completed: true },
      { milestone: "Costruzione Chassis", date: "2025-01-20", completed: true },
      { milestone: "Sistema Sensoriale", date: "2025-02-10", completed: false },
      { milestone: "Presentazione Finale", date: "2025-03-15", completed: false },
    ],
    budget: 500,
    spent: 320,
  },
  {
    id: 2,
    title: "Progetto Letterario - Analisi Dante",
    description: "Studio approfondito della Divina Commedia con tesi interpretativa",
    status: "Completato",
    progress: 100,
    members: ["Maria G.", "Giuseppe T."],
    deadline: "2025-01-30",
    category: "Progetto Accademico",
    timeline: [
      { milestone: "Ricerca", date: "2024-12-01", completed: true },
      { milestone: "Scritto Prima Bozza", date: "2025-01-10", completed: true },
      { milestone: "Revisione", date: "2025-01-25", completed: true },
      { milestone: "Presentazione", date: "2025-01-30", completed: true },
    ],
    budget: 0,
    spent: 0,
  },
  {
    id: 3,
    title: "Progetto Scientifico - Energia Rinnovabile",
    description: "Ricerca e prototipo di pannello solare fai-da-te",
    status: "Pianificazione",
    progress: 15,
    members: ["Andrea B.", "Chiara L."],
    deadline: "2025-04-30",
    category: "Progetto Scientifico",
    timeline: [
      { milestone: "Pianificazione", date: "2025-02-01", completed: false },
      { milestone: "Raccolta Materiali", date: "2025-02-15", completed: false },
      { milestone: "Costruzione Prototipo", date: "2025-03-15", completed: false },
      { milestone: "Test e Risultati", date: "2025-04-30", completed: false },
    ],
    budget: 200,
    spent: 0,
  },
]

const progressData = [
  { week: "Set 1", robots: 10, art: 5, energy: 2 },
  { week: "Set 2", robots: 15, art: 8, energy: 4 },
  { week: "Set 3", robots: 22, art: 12, energy: 6 },
  { week: "Set 4", robots: 35, art: 18, energy: 10 },
]

export default function ProjektiPage() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const selectedProjectData = selectedProject ? projects.find((p) => p.id === selectedProject) : projects[0]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Progetti e Attività</h1>
            <p className="text-foreground/60">Collabora e gestisci progetti di classe</p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            Nuovo Progetto
          </Button>
        </div>

        {/* Projects List */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {projects.map((project) => (
            <Card
              key={project.id}
              onClick={() => setSelectedProject(project.id)}
              className={`p-6 cursor-pointer transition-all border-l-4 ${
                selectedProject === project.id
                  ? "border-l-primary bg-primary/5 shadow-lg"
                  : "border-l-secondary hover:shadow-md"
              }`}
            >
              <h3 className="font-bold mb-2 line-clamp-2">{project.title}</h3>
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-foreground/60">Progresso</span>
                  <span className="font-semibold">{project.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-foreground/60 mb-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    project.status === "Completato"
                      ? "bg-green-500/10 text-green-700"
                      : project.status === "In Corso"
                        ? "bg-blue-500/10 text-blue-700"
                        : "bg-yellow-500/10 text-yellow-700"
                  }`}
                >
                  {project.status}
                </span>
                <Calendar className="w-4 h-4" />
                <span className="text-xs">{project.deadline}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-foreground/60">
                <Users className="w-4 h-4" />
                <span>{project.members.length} membri</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Project Details */}
        {selectedProjectData && (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full md:w-auto md:grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="progress">Avanzamento</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-4">{selectedProjectData.title}</h2>
                <p className="text-foreground/70 mb-6">{selectedProjectData.description}</p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="font-semibold mb-4">Informazioni</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-foreground/60">Categoria</span>
                        <span className="font-medium">{selectedProjectData.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/60">Scadenza</span>
                        <span className="font-medium">{selectedProjectData.deadline}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/60">Stato</span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            selectedProjectData.status === "Completato"
                              ? "bg-green-500/10 text-green-700"
                              : selectedProjectData.status === "In Corso"
                                ? "bg-blue-500/10 text-blue-700"
                                : "bg-yellow-500/10 text-yellow-700"
                          }`}
                        >
                          {selectedProjectData.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/60">Progresso</span>
                        <span className="font-bold text-primary">{selectedProjectData.progress}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Budget</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-foreground/60 mb-1">Speso vs Disponibile</p>
                        <div className="flex justify-between text-sm font-medium mb-2">
                          <span>
                            €{selectedProjectData.spent} / €{selectedProjectData.budget}
                          </span>
                          <span className="text-primary">
                            {selectedProjectData.budget
                              ? Math.round((selectedProjectData.spent / selectedProjectData.budget) * 100)
                              : 0}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                            style={{
                              width: selectedProjectData.budget
                                ? `${Math.min((selectedProjectData.spent / selectedProjectData.budget) * 100, 100)}%`
                                : "0%",
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/progetti/${selectedProject}/discussioni`}>
                    <Button className="gap-2 bg-primary hover:bg-primary/90">
                      <MessageCircle className="w-4 h-4" />
                      Discussioni
                    </Button>
                  </Link>
                  <Button variant="outline">Scarica Report</Button>
                </div>
              </Card>
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline">
              <Card className="p-8">
                <h2 className="text-xl font-bold mb-6">Milestone Progetto</h2>
                <div className="space-y-4">
                  {selectedProjectData.timeline.map((milestone, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition"
                    >
                      <div className="mt-1">
                        {milestone.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{milestone.milestone}</h3>
                        <p className="text-sm text-foreground/60">{milestone.date}</p>
                      </div>
                      <div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            milestone.completed ? "bg-green-500/10 text-green-700" : "bg-yellow-500/10 text-yellow-700"
                          }`}
                        >
                          {milestone.completed ? "Completato" : "In Corso"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team">
              <Card className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Team Progetto</h2>
                  <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4" />
                    Aggiungi Membro
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {selectedProjectData.members.map((member, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white text-lg">
                        {member.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{member}</p>
                        <p className="text-xs text-foreground/60">Membro del team</p>
                      </div>
                      <Eye className="w-4 h-4 text-foreground/40" />
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress">
              <Card className="p-8">
                <h2 className="text-xl font-bold mb-6">Avanzamento Settimanale</h2>
                <div className="overflow-x-auto">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="week" stroke="var(--color-muted-foreground)" />
                      <YAxis stroke="var(--color-muted-foreground)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-card)",
                          border: "1px solid var(--color-border)",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="robots" fill="var(--color-primary)" name="Robotica" />
                      <Bar dataKey="art" fill="var(--color-secondary)" name="Letteratura" />
                      <Bar dataKey="energy" fill="var(--color-accent)" name="Energia" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
