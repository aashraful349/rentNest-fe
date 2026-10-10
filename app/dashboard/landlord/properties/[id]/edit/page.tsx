import React from "react"
import { notFound } from "next/navigation"
import { getPropertyDetails } from "@/services/GetPropertyDetails"
import EditPropertyForm from "./_components/EditPropertyForm"

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const res = await getPropertyDetails(id)

  const property = res?.success ? res?.data : res?.data || res || null

  if (!property) {
    notFound()
  }

  return <EditPropertyForm property={property} />
}

