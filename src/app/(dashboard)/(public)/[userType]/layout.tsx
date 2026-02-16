import { UserRouteType } from '@/features/service/artspace/get-users'
import { notFound } from 'next/navigation';
import React from 'react'

const UserTypeLayout = async ({ children, params }: { params: Promise<{ userType: string }>, children: React.ReactNode }) => {
  const { userType } = await params as { userType: UserRouteType };

  if (!userType || (userType !== 'artists' && userType !== 'galleries' && userType !== 'collectors')) {
    return notFound();
  }

  return (
    <>
      {children}
    </>
  )
}

export default UserTypeLayout
