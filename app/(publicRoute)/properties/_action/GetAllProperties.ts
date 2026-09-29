"use server"

export const GetAllProperties = async () => {
  let dataPromise=await fetch(`${process.env.BACKEND_API_URL}/api/properties`);

  const data=await dataPromise.json();

//   console.log(data);
return data;
}
