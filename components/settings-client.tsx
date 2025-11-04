"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { getUserSettings, updateUserSettings, type UserSettings } from "@/lib/actions/settings"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function SettingsClient() {
  const [settings, setSettings] = useState<UserSettings>({
    notificationsEmail: true,
    notificationsPush: false,
    publicProfile: true,
    newsletter: true,
    privateMessages: true,
    showActivity: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    setLoading(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const userSettings = await getUserSettings(user.id)
      setSettings(userSettings)
    }
    setLoading(false)
  }

  const handleToggle = (key: keyof UserSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = async () => {
    setSaving(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      try {
        await updateUserSettings(user.id, settings)
        toast({
          title: "Impostazioni salvate",
          description: "Le tue preferenze sono state aggiornate con successo",
        })
      } catch (error) {
        toast({
          title: "Errore",
          description: "Impossibile salvare le impostazioni",
          variant: "destructive",
        })
      }
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/profilo" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
        <ArrowLeft className="w-4 h-4" />
        Torna al profilo
      </Link>

      <Card className="p-8">
        <h1 className="text-3xl font-bold mb-8">Impostazioni</h1>

        <div className="mb-8 pb-8 border-b border-border">
          <h2 className="text-xl font-semibold mb-6">Notifiche</h2>
          <div className="space-y-4">
            {[
              {
                key: "notificationsEmail" as keyof UserSettings,
                label: "Email per nuove risposte",
                description: "Ricevi email quando qualcuno risponde ai tuoi post",
              },
              {
                key: "notificationsPush" as keyof UserSettings,
                label: "Notifiche push",
                description: "Ricevi notifiche push sul browser",
              },
              {
                key: "newsletter" as keyof UserSettings,
                label: "Newsletter settimanale",
                description: "Ricevi un riepilogo settimanale dell'attività della classe",
              },
            ].map((notif) => (
              <label key={notif.key} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[notif.key]}
                  onChange={() => handleToggle(notif.key)}
                  className="w-4 h-4 mt-1 rounded"
                />
                <div>
                  <p className="font-medium">{notif.label}</p>
                  <p className="text-sm text-foreground/60">{notif.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-8 pb-8 border-b border-border">
          <h2 className="text-xl font-semibold mb-6">Privacy</h2>
          <div className="space-y-4">
            {[
              {
                key: "publicProfile" as keyof UserSettings,
                label: "Profilo pubblico",
                description: "Consenti agli altri di visualizzare il tuo profilo",
              },
              {
                key: "privateMessages" as keyof UserSettings,
                label: "Messaggi privati",
                description: "Consenti ai compagni di mandarti messaggi privati",
              },
              {
                key: "showActivity" as keyof UserSettings,
                label: "Mostra attività",
                description: "Mostra la tua attività recente agli altri",
              },
            ].map((privacy) => (
              <label key={privacy.key} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[privacy.key]}
                  onChange={() => handleToggle(privacy.key)}
                  className="w-4 h-4 mt-1 rounded"
                />
                <div>
                  <p className="font-medium">{privacy.label}</p>
                  <p className="text-sm text-foreground/60">{privacy.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90">
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvataggio...
              </>
            ) : (
              "Salva Impostazioni"
            )}
          </Button>
          <Link href="/profilo">
            <Button variant="outline">Annulla</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
