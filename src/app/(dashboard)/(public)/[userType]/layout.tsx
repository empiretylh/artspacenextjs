import { UserRouteType } from '@/features/service/artspace/get-users'
import { notFound } from 'next/navigation';
import React from 'react'

const UserTypeLayout = async ({ children, params }: { params: Promise<{ userType: UserRouteType }>, children: React.ReactNode }) => {
  const { userType } = await params;

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
