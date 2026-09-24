export interface IProperty {
  id: string
  availability: string
  pName: string
  pLocation: string
  pPrice: string
  pImage: string
  category: {
    id: string
    type: string
  }
  createdAt: string
}
