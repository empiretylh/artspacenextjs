import ChatPage from '@/features/chat/pages/chat-page'
import { env } from '@/config/env'
import { redirect } from 'next/navigation'

const page = () => {
  if (!env.NEXT_PUBLIC_FEATURE_CHAT_ENABLE) {
    redirect('/')
  }

  return (
    <ChatPage />
  )
}

export default page
