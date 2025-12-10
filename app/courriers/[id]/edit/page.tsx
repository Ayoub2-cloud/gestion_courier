"use client"

import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function EditCourrierPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()

  return (
    <div className="space-y-6 p-6">
      <Link href={`/courriers/${id}`}>
        <Button variant="outline" className="gap-2 bg-transparent">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
      </Link>
      <div>
        <h1 className="text-3xl font-bold">Modifier le Courrier</h1>
        <p className="text-muted-foreground">Cette fonctionnalité sera disponible prochainement</p>
      </div>
    </div>
  )
}
