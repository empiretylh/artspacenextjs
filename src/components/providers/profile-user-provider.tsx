// app/context-provider.tsx
'use client';
import { User } from '@/types';
import { createContext, useContext, useState, useMemo, Dispatch, SetStateAction } from 'react';

type ProfileUserContextType = {
  data: User;
  setData: Dispatch<SetStateAction<User>>;
};

const DataContext = createContext<ProfileUserContextType | undefined>(undefined);

export const ProfileUserProvider = ({ children, initialValue }: { children: React.ReactNode; initialValue: User }) => {
  const [data, setData] = useState(initialValue);
  const value = useMemo(() => ({ data, setData }), [data]);
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useProfileUser = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useProfileUser must be used within a ProfileUserProvider');
  }
  return context;
};
