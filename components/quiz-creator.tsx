"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Save } from "lucide-react"
import { createQuiz, addQuizQuestion } from "@/lib/actions/quiz"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

type Question = {
  question: string
  options: string[]
  correct_answer: string
  explanation: string
}

export function QuizCreator() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [difficulty, setDifficulty] = useState("Facile")
  const [timeLimit, setTimeLimit] = useState<number | undefined>()
  const [passingScore, setPassingScore] = useState(70)
  const [subjectId, setSubjectId] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  function addQuestion() {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correct_answer: "",
        explanation: "",
      },
    ])
  }

  function updateQuestion(index: number, field: keyof Question, value: any) {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  function updateOption(questionIndex: number, optionIndex: number, value: string) {
    const updated = [...questions]
    updated[questionIndex].options[optionIndex] = value
    setQuestions(updated)
  }

  function removeQuestion(index: number) {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  async function handleSave() {
    if (!title || !description || !subjectId || questions.length === 0) {
      toast({
        title: "Errore",
        description: "Compila tutti i campi e aggiungi almeno una domanda",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      // Create quiz
      const quiz = await createQuiz({
        title,
        description,
        difficulty,
        time_limit: timeLimit,
        passing_score: passingScore,
        subject_id: subjectId,
      })

      // Add questions
      for (const question of questions) {
        await addQuizQuestion(quiz.id, question)
      }

      toast({
        title: "Quiz creato!",
        description: "Il quiz è stato pubblicato con successo",
      })

      router.push("/quiz")
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile creare il quiz",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Informazioni Quiz</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Titolo</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Es: Quiz di Matematica - Capitolo 3"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Descrizione</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descrizione del quiz..."
            />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Difficoltà</label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Facile">Facile</SelectItem>
                  <SelectItem value="Intermedio">Intermedio</SelectItem>
                  <SelectItem value="Difficile">Difficile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tempo Limite (min)</label>
              <Input
                type="number"
                value={timeLimit || ""}
                onChange={(e) => setTimeLimit(e.target.value ? Number.parseInt(e.target.value) : undefined)}
                placeholder="Opzionale"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Punteggio Minimo (%)</label>
              <Input
                type="number"
                value={passingScore}
                onChange={(e) => setPassingScore(Number.parseInt(e.target.value))}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Materia ID</label>
            <Input value={subjectId} onChange={(e) => setSubjectId(e.target.value)} placeholder="UUID della materia" />
          </div>
        </div>
      </Card>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Domande ({questions.length})</h2>
        <Button onClick={addQuestion} className="gap-2">
          <Plus className="w-4 h-4" />
          Aggiungi Domanda
        </Button>
      </div>

      {questions.map((question, qIndex) => (
        <Card key={qIndex} className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold">Domanda {qIndex + 1}</h3>
            <Button variant="ghost" size="sm" onClick={() => removeQuestion(qIndex)} className="text-red-500">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Testo Domanda</label>
              <Textarea
                value={question.question}
                onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
                placeholder="Scrivi la domanda..."
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Opzioni di Risposta</label>
              <div className="space-y-2">
                {question.options.map((option, oIndex) => (
                  <Input
                    key={oIndex}
                    value={option}
                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                    placeholder={`Opzione ${oIndex + 1}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Risposta Corretta</label>
              <Select
                value={question.correct_answer}
                onValueChange={(value) => updateQuestion(qIndex, "correct_answer", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona risposta corretta" />
                </SelectTrigger>
                <SelectContent>
                  {question.options
                    .filter((o) => o)
                    .map((option, i) => (
                      <SelectItem key={i} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Spiegazione (opzionale)</label>
              <Textarea
                value={question.explanation}
                onChange={(e) => updateQuestion(qIndex, "explanation", e.target.value)}
                placeholder="Spiega perché questa è la risposta corretta..."
              />
            </div>
          </div>
        </Card>
      ))}

      <Button onClick={handleSave} disabled={saving} className="w-full gap-2 bg-primary hover:bg-primary/90" size="lg">
        <Save className="w-4 h-4" />
        {saving ? "Salvataggio..." : "Salva e Pubblica Quiz"}
      </Button>
    </div>
  )
}
