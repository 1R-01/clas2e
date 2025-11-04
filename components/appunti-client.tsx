"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye, User, Plus, Search, Grid3x3, List } from "lucide-react"
import { getMaterials, incrementMaterialViews, incrementMaterialDownloads } from "@/lib/actions/materials"
import { awardXP } from "@/lib/actions/gamification"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

type Material = {
  id: string
  title: string
  description: string | null
  subject_id: string
  file_url: string
  file_type: string
  file_size: number
  views: number
  downloads: number
  created_at: string
  user_id: string
  subjects: { name: string } | null
  users: { full_name: string | null } | null
}

export function AppuntiClient() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedSubject, setSelectedSubject] = useState("Tutti")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [subjects, setSubjects] = useState<Array<{ id: string; name: string }>>([])
  const { toast } = useToast()
  const supabase = createClient()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    loadMaterials()
    checkAdmin()
    loadSubjects()
  }, [])

  async function loadMaterials() {
    setLoading(true)
    const data = await getMaterials()
    setMaterials(data)
    setLoading(false)
  }

  async function loadSubjects() {
    const { data, error } = await supabase.from("subjects").select("id, name").order("name")
    if (!error && data) {
      setSubjects(data)
    }
  }

  async function checkAdmin() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase.from("users").select("role").eq("id", user.id).single()

      setIsAdmin(data?.role === "admin" || data?.role === "teacher")
    }
  }

  async function handleDownload(material: Material) {
    await incrementMaterialDownloads(material.id)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      await awardXP(user.id, 5, "download_material")
    }

    // Actually download the file
    const link = document.createElement("a")
    link.href = material.file_url
    link.download = material.title
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Download avviato",
      description: "+5 XP guadagnati!",
    })
    loadMaterials()
  }

  async function handleView(materialId: string) {
    await incrementMaterialViews(materialId)
    loadMaterials()
  }

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setUploading(true)

    const formData = new FormData(e.currentTarget)
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const subjectId = formData.get("subject") as string

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Non autenticato")

      // Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      const { data: uploadData, error: uploadError } = await supabase.storage.from("materials").upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("materials").getPublicUrl(fileName)

      // Create material record
      const { error: insertError } = await supabase.from("materials").insert({
        title,
        description,
        subject_id: subjectId,
        file_url: publicUrl,
        file_type: file.type,
        file_size: file.size,
        uploaded_by: user.id,
      })

      if (insertError) throw insertError

      // Award XP for uploading
      await awardXP(user.id, 20, "upload_material")

      toast({
        title: "Caricamento completato!",
        description: "+20 XP guadagnati per aver condiviso materiale!",
      })

      setUploadOpen(false)
      loadMaterials()
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile caricare il file",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const subjectNames = ["Tutti", ...subjects.map((s) => s.name)]

  const filteredMaterials = materials.filter((material) => {
    const matchSearch =
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchSubject = selectedSubject === "Tutti" || material.subjects?.name === selectedSubject
    return matchSearch && matchSubject
  })

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Caricamento...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Appunti e Materiali</h1>
          <p className="text-foreground/60">Condividi e accedi a risorse didattiche della classe</p>
        </div>

        {isAdmin && (
          <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4" />
                Carica Appunto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Carica Nuovo Materiale</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Titolo</label>
                  <Input name="title" required placeholder="Es: Riassunto Fotosintesi" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Descrizione</label>
                  <Textarea name="description" placeholder="Breve descrizione del materiale..." />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Materia</label>
                  <Select name="subject" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona materia" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">File</label>
                  <Input name="file" type="file" required accept=".pdf,.doc,.docx,.ppt,.pptx" />
                </div>
                <Button type="submit" disabled={uploading} className="w-full">
                  {uploading ? "Caricamento..." : "Carica"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search and View Toggle */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
          <input
            type="text"
            placeholder="Cerca appunti..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded transition ${
              viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted-foreground/20"
            }`}
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded transition ${
              viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted-foreground/20"
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-20">
            <h3 className="font-bold mb-4">Filtri</h3>
            <div className="mb-6">
              <p className="text-sm font-semibold mb-3 text-foreground/70">Materia</p>
              <div className="space-y-2">
                {subjectNames.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    className={`w-full text-left px-3 py-2 rounded transition ${
                      selectedSubject === subject
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-foreground/60 hover:bg-muted"
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Materials Grid/List */}
        <div className="lg:col-span-3">
          {viewMode === "grid" ? (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredMaterials.map((material) => (
                <Card
                  key={material.id}
                  className="p-6 hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-primary"
                  onClick={() => handleView(material.id)}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="text-3xl">📄</div>
                    <div className="flex-1">
                      <h3 className="font-bold mb-1">{material.title}</h3>
                      <p className="text-xs text-foreground/60">
                        {material.file_type} • {formatFileSize(material.file_size)}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-foreground/70 mb-4 line-clamp-2">{material.description}</p>

                  <div className="flex items-center justify-between text-xs text-foreground/60 mb-4 py-3 border-t border-border">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {material.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" /> {material.downloads}
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" /> {material.users?.full_name || "Anonimo"}
                    </span>
                  </div>

                  <Button
                    className="w-full gap-2 bg-primary hover:bg-primary/90"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDownload(material)
                    }}
                  >
                    <Download className="w-4 h-4" />
                    Scarica
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMaterials.map((material) => (
                <Card
                  key={material.id}
                  className="p-4 hover:shadow-md transition-all cursor-pointer border-l-4 border-l-primary"
                  onClick={() => handleView(material.id)}
                >
                  <div className="flex items-center gap-4 justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-2xl">📄</div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{material.title}</h3>
                        <p className="text-sm text-foreground/60">
                          {material.subjects?.name} • {material.file_type} • {formatFileSize(material.file_size)} • di{" "}
                          {material.users?.full_name || "Anonimo"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-foreground/60">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" /> {material.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" /> {material.downloads}
                      </span>
                      <Button
                        className="gap-2 bg-primary hover:bg-primary/90"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownload(material)
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {filteredMaterials.length === 0 && (
            <Card className="p-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-foreground/30" />
              <p className="text-foreground/60">Nessun appunto trovato</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
