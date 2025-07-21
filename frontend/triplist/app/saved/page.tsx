import { auth } from "@/auth"
 
export default async function SavedTrips() {
  const session = await auth()
  if (!session) return <div className="flex items-center justify-center ">Sign in to see your saved trips</div>
 
  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}