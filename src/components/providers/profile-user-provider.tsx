// app/context-provider.tsx
'use client';
import { User } from '@/types';
import { createContext, useContext, useState } from 'react';

const DataContext = createContext<User>({} as User);

export const ProfileUserProvider = ({ children, initialValue }: { children: React.ReactNode; initialValue: User }) => {
  const [data, setData] = useState(initialValue);
  return <DataContext.Provider value={{ data, setData }}>{children}</DataContext.Provider>;
};

export const useProfileUser = () => useContext<{ data: User; setData: any }>(DataContext);
