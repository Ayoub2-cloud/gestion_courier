"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { storage } from "@/lib/storage"
import type { RefState } from "@/lib/types"
import { Plus, Edit2, Trash2, ArrowLeft } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export default function StatesPage() {
  const router = useRouter()
  const [states, setStates] = useState<RefState[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    label: "",
    description: "",
    color: "#3B82F6",
  })

  useEffect(() => {
    setStates(storage.getRefStates())
  }, [])

  const handleOpenDialog = (state?: RefState) => {
    if (state) {
      setFormData({
        label: state.label,
        description: state.description,
        color: state.color || "#3B82F6",
      })
      setEditingId(state.id)
    } else {
      setFormData({ label: "", description: "", color: "#3B82F6" })
      setEditingId(null)
    }
    setIsOpen(true)
  }

  const handleSubmit = () => {
    if (!formData.label) {
      alert("Le libellé est obligatoire")
      return
    }

    if (editingId) {
      storage.updateRefState(editingId, formData)
    } else {
      storage.addRefState({
        id: Date.now().toString(),
        ...formData,
      })
    }

    setStates(storage.getRefStates())
    setIsOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr ?")) {
      storage.deleteRefState(id)
      setStates(storage.getRefStates())
    }
  }

  return (
    <div className="space-y-6 p-6">
      <Button variant="outline" onClick={() => router.back()} className="gap-2 bg-transparent w-fit mb-4">
        <ArrowLeft className="w-4 h-4" />
        Retour
      </Button>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">États de Traitement</h1>
          <p className="text-muted-foreground">Gérez les états de courrier</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Nouvel État
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Modifier" : "Créer"} un État</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Libellé *</label>
                <Input value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Couleur</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-12 h-10 border rounded"
                  />
                  <Input value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
                </div>
              </div>
              <Button onClick={handleSubmit} className="w-full">
                {editingId ? "Modifier" : "Créer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {states.map((state) => (
          <Card key={state.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: state.color }} />
                <CardTitle className="text-lg">{state.label}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{state.description}</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => handleOpenDialog(state)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(state.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
