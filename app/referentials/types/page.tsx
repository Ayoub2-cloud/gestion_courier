"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { storage } from "@/lib/storage"
import type { CourierType } from "@/lib/types"
import { Plus, Edit2, Trash2, ArrowLeft } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export default function TypesPage() {
  const router = useRouter()
  const [types, setTypes] = useState<CourierType[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    label: "",
    description: "",
  })

  useEffect(() => {
    setTypes(storage.getCourierTypes())
  }, [])

  const handleOpenDialog = (type?: CourierType) => {
    if (type) {
      setFormData({ label: type.label, description: type.description })
      setEditingId(type.id)
    } else {
      setFormData({ label: "", description: "" })
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
      storage.updateCourierType(editingId, formData)
    } else {
      storage.addCourierType({
        id: Date.now().toString(),
        ...formData,
      })
    }

    setTypes(storage.getCourierTypes())
    setIsOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr ?")) {
      storage.deleteCourierType(id)
      setTypes(storage.getCourierTypes())
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
          <h1 className="text-3xl font-bold">Types de Courrier</h1>
          <p className="text-muted-foreground">Gérez les types de courrier</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Nouveau Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Modifier" : "Créer"} un Type</DialogTitle>
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
              <Button onClick={handleSubmit} className="w-full">
                {editingId ? "Modifier" : "Créer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {types.map((type) => (
          <Card key={type.id}>
            <CardHeader>
              <CardTitle className="text-lg">{type.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{type.description}</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => handleOpenDialog(type)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(type.id)}>
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
