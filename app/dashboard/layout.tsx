import { Navbar } from '@/components/shared/navbar'
import { getMe } from '@/services/getMe'
import React from 'react'

const layout = async ({children}:{children:React.ReactNode}) => {
  const currentUser = await getMe()
  return (
    <div>
        <Navbar user={currentUser}/>
        {children}
    </div>
  )
}

export default layout
