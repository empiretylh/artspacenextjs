import { useProfileUser } from '@/components/providers/profile-user-provider';
import { useAuth } from '@/features/auth/store';
import { useGetArtist } from '@/features/service/artspace/get-artist';
import React from 'react'

const ArtistLayoutContainer = ({ children, id }: { children: React.ReactNode, id: string }) => {
  const { accessToken } = useAuth()
  const userQuery = useGetArtist({ artistId: id, queryConfig: { enabled: accessToken !== null && !!accessToken } });
  const profileUser = useProfileUser();
  const user = userQuery.data || profileUser.data

  if (userQuery.isLoading) return <div>Loading...</div>

  return (
    <>{children}</>
  )
}

export default ArtistLayoutContainer
