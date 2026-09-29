export interface IProperty {
  id: string
  availability: string
  pName: string
  pLocation: string
  pPrice: string
  pImage: string
  feature: boolean
  category: {
    id: string
    type: string
  }
  createdAt: string
}


export interface DProperty{
    id: string
    landLordId: string
    pName: string
    availability: string
    pLocation: string
    pPrice: string
    pDescription: string
    pImage: string
    feature:boolean
    createdAt: string
    updatedAt: string
    category: {
        id: string
        pId: string
        type: string
        description: string
        createdAt: string
        updatedAt: string
    }
}
