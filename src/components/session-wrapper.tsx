import { getSession } from "@/lib/auth"
import { User } from "@/types"

const SessionWrapper = async ({ render }: { render: ({ user, accessToken }: { user: User | null, accessToken: string | null }) => React.ReactNode }) => {
  const { user, accessToken } = await getSession()

  return render({ user, accessToken })
}

export default SessionWrapper
