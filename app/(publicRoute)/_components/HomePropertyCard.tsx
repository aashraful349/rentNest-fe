import React from "react"
import { GetAllProperties } from "../_action/GetAllProperties"
import { IProperty } from "@/lib/type"
import FeaturedPropertiesSection from "./FeaturedPropertiesSection"

const PropertyCard = async () => {
  const properties = await GetAllProperties()
  const list: IProperty[] = Array.isArray(properties)
    ? properties
    : properties?.data || properties?.properties || []

  return <FeaturedPropertiesSection initialProperties={list} />
}

export default PropertyCard
