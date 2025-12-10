"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { storage } from "@/lib/storage"
import type { Entity } from "@/lib/types"
import { Plus, Edit2, Trash2, ArrowLeft } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EntitiesPage() {
  const router = useRouter()
  const [entities, setEntities] = useState<Entity[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    label: "",
    description: "",
    parentEntityId: "",
    chefId: "",
    email: "",
    phone: "",
    code: "",
  })

  const users = storage.getUsers()
  const allEntities = storage.getEntities()

  useEffect(() => {
    setEntities(allEntities)
  }, [])

  const handleOpenDialog = (entity?: Entity) => {
    if (entity) {
      setFormData({
        label: entity.label,
        description: entity.description,
        parentEntityId: entity.parentEntityId || "",
        chefId: entity.chefId || "",
        email: entity.email || "",
        phone: entity.phone || "",
        code: entity.code || "",
      })
      setEditingId(entity.id)
    } else {
      setFormData({
        label: "",
        description: "",
        parentEntityId: "",
        chefId: "",
        email: "",
        phone: "",
        code: "",
      })
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
      storage.updateEntity(editingId, formData)
    } else {
      const newEntity: Entity = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date(),
      }
      storage.addEntity(newEntity)
    }

    setEntities(storage.getEntities())
    setIsOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette entité ?")) {
      storage.deleteEntity(id)
      setEntities(storage.getEntities())
    }
  }

  const getChefName = (chefId: string | undefined) => {
    if (!chefId) return "-"
    return users.find((u) => u.id === chefId)?.name || "Inconnu"
  }

  return (
    <div className="space-y-6 p-6">
      <Button variant="outline" onClick={() => router.back()} className="gap-2 bg-transparent w-fit mb-4">
        <ArrowLeft className="w-4 h-4" />
        Retour
      </Button>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Entités Administratives</h1>
          <p className="text-muted-foreground">Gérez les départements et services</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle Entité
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Modifier" : "Créer"} une Entité</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Libellé *</label>
                <Input
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Ex: Informatique"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description de l'entité"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Entité Parente</label>
                <Select
                  value={formData.parentEntityId}
                  onValueChange={(value) => setFormData({ ...formData, parentEntityId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une entité parente" />
                  </SelectTrigger>
                  <SelectContent>
                    {allEntities
                      .filter((e) => e.id !== editingId)
                      .map((entity) => (
                        <SelectItem key={entity.id} value={entity.id}>
                          {entity.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Chef d'Entité</label>
                <Select value={formData.chefId} onValueChange={(value) => setFormData({ ...formData, chefId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un chef" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Téléphone</label>
                  <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Code Interne</label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Ex: INFO"
                />
              </div>
              <Button onClick={handleSubmit} className="w-full">
                {editingId ? "Modifier" : "Créer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Entités ({entities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {entities.map((entity) => (
              <div key={entity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted">
                <div className="flex-1">
                  <h3 className="font-semibold">{entity.label}</h3>
                  <p className="text-sm text-muted-foreground">{entity.description}</p>
                  <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                    {entity.code && <span>Code: {entity.code}</span>}
                    {entity.email && <span>Email: {entity.email}</span>}
                    {entity.chefId && <span>Chef: {getChefName(entity.chefId)}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(entity)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(entity.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
