"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThumbsUp, MessageCircle, User, Clock, Reply, Send, ArrowLeft } from "lucide-react"
import Link from "next/link"

const discussionDetails = {
  id: 1,
  title: "Come preparare la relazione di laboratorio?",
  category: "Fisica",
  author: "Maria G.",
  avatar: "👩‍💼",
  date: "4 ore fa",
  content:
    "Ciao a tutti! Ho alcuni dubbi sulla struttura della relazione di laboratorio. Quale è il formato corretto? Devo includere specifiche sezioni?",
  likes: 12,
  replies: 8,
  views: 124,
}

const comments = [
  {
    id: 1,
    author: "Marco L.",
    avatar: "👨‍💻",
    date: "3 ore fa",
    content:
      "Dipende dall'insegnante, ma generalmente serve:\n1. Obiettivo\n2. Materiali utilizzati\n3. Procedura\n4. Risultati\n5. Conclusioni",
    likes: 5,
    replies: [
      {
        id: 1,
        author: "Maria G.",
        avatar: "👩‍💼",
        date: "2 ore fa",
        content: "Grazie Marco! Questo mi aiuta molto. Quante pagine dovrebbe avere circa?",
        likes: 1,
      },
    ],
  },
  {
    id: 2,
    author: "Prof. Rossi",
    avatar: "🧑‍🏫",
    date: "2 ore fa",
    content:
      "Aggiungo i miei consigli: fate attenzione ai grafici e alle tabelle. Devono essere chiari e ben etichettati. Massimo 5-6 pagine.",
    likes: 8,
    replies: [],
  },
]

export default function DiscussionDetailPage({ params }: { params: { id: string } }) {
  const [liked, setLiked] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [localComments, setLocalComments] = useState(comments)

  const handleAddComment = () => {
    if (replyText.trim()) {
      const newComment = {
        id: localComments.length + 1,
        author: "Tu",
        avatar: "👤",
        date: "ora",
        content: replyText,
        likes: 0,
        replies: [],
      }
      setLocalComments([...localComments, newComment])
      setReplyText("")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/forum" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Torna al Forum
        </Link>

        {/* Original Post */}
        <Card className="p-8 mb-8 border-l-4 border-l-primary">
          <div className="flex gap-4 mb-6">
            <div className="text-4xl">{discussionDetails.avatar}</div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-3">{discussionDetails.title}</h1>
              <div className="flex gap-4 text-sm text-foreground/60">
                <span className="bg-primary/10 px-2 py-1 rounded">{discussionDetails.category}</span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {discussionDetails.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {discussionDetails.date}
                </span>
              </div>
            </div>
          </div>

          <p className="text-foreground/80 mb-6 leading-relaxed whitespace-pre-line">{discussionDetails.content}</p>

          <div className="flex gap-4 text-foreground/60">
            <button onClick={() => setLiked(!liked)} className="flex items-center gap-2 hover:text-primary transition">
              <ThumbsUp className="w-5 h-5" fill={liked ? "currentColor" : "none"} />
              <span>{discussionDetails.likes + (liked ? 1 : 0)}</span>
            </button>
            <button className="flex items-center gap-2 hover:text-secondary transition">
              <MessageCircle className="w-5 h-5" />
              <span>{discussionDetails.replies} risposte</span>
            </button>
          </div>
        </Card>

        {/* Comments */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold">Risposte ({localComments.length})</h2>

          {localComments.map((comment) => (
            <div key={comment.id}>
              <Card className="p-6">
                <div className="flex gap-4 mb-4">
                  <div className="text-3xl">{comment.avatar}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold">{comment.author}</p>
                        <p className="text-xs text-foreground/60">{comment.date}</p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">Membro della classe</span>
                    </div>
                    <p className="text-foreground/80 mb-4 whitespace-pre-line">{comment.content}</p>
                    <div className="flex gap-4">
                      <button className="text-sm text-foreground/60 hover:text-primary transition flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {comment.likes}
                      </button>
                      <button className="text-sm text-foreground/60 hover:text-secondary transition flex items-center gap-1">
                        <Reply className="w-4 h-4" />
                        Rispondi
                      </button>
                    </div>
                  </div>
                </div>

                {/* Nested Replies */}
                {comment.replies.length > 0 && (
                  <div className="ml-8 mt-4 space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="p-4 bg-muted/30 rounded-lg border-l-2 border-l-secondary">
                        <div className="flex gap-3 mb-3">
                          <div className="text-xl">{reply.avatar}</div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{reply.author}</p>
                            <p className="text-xs text-foreground/60">{reply.date}</p>
                          </div>
                        </div>
                        <p className="text-sm text-foreground/80">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>

        {/* Reply Form */}
        <Card className="p-8 bg-card/50">
          <h3 className="text-xl font-bold mb-4">Scrivi una risposta</h3>
          <div className="space-y-4">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="La tua risposta..."
              className="w-full p-4 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-32"
            />
            <div className="flex gap-3">
              <Button onClick={handleAddComment} className="gap-2 bg-primary hover:bg-primary/90">
                <Send className="w-4 h-4" />
                Invia Risposta
              </Button>
              <Button variant="outline">Anteprima</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
