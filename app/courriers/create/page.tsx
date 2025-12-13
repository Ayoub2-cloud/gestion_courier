"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { storage } from "@/lib/storage"
import { useAuth } from "@/lib/auth-context"
import type { Courrier, Attachment } from "@/lib/types"
import { CourierState, Priority } from "@/lib/types"
import { Upload, X, ArrowLeft } from "lucide-react"

export default function CreateCourrierPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    type: "",
    category: "",
    toEntity: "",
    subject: "",
    description: "",
    priority: Priority.NORMAL,
  })
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const types = storage.getCourierTypes()
  const categories = storage.getCategories()
  const entities = storage.getEntities()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          const newAttachment: Attachment = {
            id: Date.now().toString(),
            name: file.name,
            type: file.type,
            size: file.size,
            url: event.target?.result as string,
            uploadedAt: new Date(),
          }
          setAttachments((prev) => [...prev, newAttachment])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  const generateReference = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const random = Math.random().toString(36).substring(2, 7).toUpperCase()
    return `ESTSB-${year}${month}-${random}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.type || !formData.category || !formData.toEntity || !formData.subject) {
        alert("Veuillez remplir tous les champs obligatoires")
        setIsSubmitting(false)
        return
      }

      const newCourrier: Courrier = {
        id: Date.now().toString(),
        reference: generateReference(),
        type: formData.type,
        category: formData.category,
        toEntity: formData.toEntity,
        state: CourierState.NEW,
        subject: formData.subject,
        description: formData.description,
        priority: formData.priority as Priority,
        createdBy: user?.id || "unknown",
        createdAt: new Date(),
        attachments,
        history: [
          {
            state: CourierState.NEW,
            changedBy: user?.id || "unknown",
            changedAt: new Date(),
          },
        ],
      }

      storage.addCourrier(newCourrier)

      // Auto-assign to chef if entity has one
      const entity = entities.find((e) => e.id === formData.toEntity)
      if (entity?.chefId) {
        // Chef will automatically see it in their list
      }

      router.push("/courriers")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <Button variant="outline" onClick={() => router.back()} className="gap-2 bg-transparent w-fit mb-4">
        <ArrowLeft className="w-4 h-4" />
        Retour
      </Button>

      <div>
        <h1 className="text-3xl font-bold">Créer un Courrier</h1>
        <p className="text-muted-foreground">Ajoutez un nouveau courrier au système</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations Générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type *</label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Catégorie *</label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Destination (Entité) *</label>
                <Select value={formData.toEntity} onValueChange={(value) => handleSelectChange("toEntity", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une entité" />
                  </SelectTrigger>
                  <SelectContent>
                    {entities.map((entity) => (
                      <SelectItem key={entity.id} value={entity.id}>
                        {entity.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Priorité</label>
                <Select value={formData.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Priority).map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sujet *</label>
              <Input
                name="subject"
                placeholder="Entrez le sujet du courrier"
                value={formData.subject}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                name="description"
                placeholder="Entrez la description détaillée du courrier"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Attachments */}
        <Card>
          <CardHeader>
            <CardTitle>Pièces Jointes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <label className="cursor-pointer">
                <span className="text-sm font-medium text-primary">Cliquez pour télécharger</span>
                <p className="text-xs text-muted-foreground mt-1">ou glissez-déposez vos fichiers (PDF, images)</p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
              </label>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{attachment.name}</p>
                      <p className="text-xs text-muted-foreground">{(attachment.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(attachment.id)}
                      className="p-1 hover:bg-red-100 rounded"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Création..." : "Créer le Courrier"}
          </Button>
        </div>
      </form>
    </div>
  )
}
