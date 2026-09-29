"use server"


export const getPropertyDetails = async (propertyId: string) => {

    let dataPromise=await fetch(`${process.env.BACKEND_API_URL}/api/properties/${propertyId}`);

    const data=await dataPromise.json();

    // console.log(data);

    return data;

}