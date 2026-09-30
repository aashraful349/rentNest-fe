"use client"

import { DProperty } from "@/lib/type";
import { getPropertyDetails } from "@/services/GetPropertyDetails"
import {useState ,useEffect } from "react";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image";

type PropertyDetailsViewProps = {
    pid: string
}

const PropertyDetailsView = ({ pid }: PropertyDetailsViewProps) => {
   const [propertyDetails, setPropertyDetails] = useState<DProperty | null>(null);

   useEffect(() => {
     const fetchPropertyDetails = async () => {
       const details = await getPropertyDetails(pid);
       if(details){
        if(details?.success===true){
            setPropertyDetails(details?.data);
        }
       }
     };

     fetchPropertyDetails();
   }, [pid]);

     const hasValidImage = (PImage:string) => {
       const hasValidImage =
         PImage && PImage !== "Image not provided"
       return hasValidImage
     }

  //  console.log("PropertyDetailsView: ", propertyDetails?.pDescription);

  return (
    <div>
      <Card className="" size="default">
      <CardHeader>
        <CardTitle>{propertyDetails?.pName}</CardTitle>
        <CardDescription className="flex flex-col">
          <p>Availability: {propertyDetails?.availability}</p>
          <p>Location: {propertyDetails?.pLocation}</p>
          <p>Price: {propertyDetails?.pPrice}</p>
          <p>Category: {propertyDetails?.category?.type}</p>
          <p>Property Listed On: {propertyDetails?.createdAt}</p>
        </CardDescription>
      </CardHeader>
      <CardContent className="-mb-(--card-spacing)">
        
        {hasValidImage(propertyDetails?.pImage as string) ? (
          <Image
            src={propertyDetails?.pImage as string}
            alt={propertyDetails?.pName || "Property Image"}
            width={500}
            height={300}
          />
        ) : (
          <p>Image not available</p>
        )}

        <p>{propertyDetails?.pDescription}</p>
        
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline">Decline</Button>
        <Button>Accept</Button>
      </CardFooter>
    </Card>
    </div>
  )
}

export default PropertyDetailsView  