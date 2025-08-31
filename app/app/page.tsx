import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CalendarLayout } from "@/components/calendar/calendar-layout"
import { CalendarPlaceholder } from "@/components/calendar/calendar-placeholder"

export default async function Home() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/auth/login")
  }

  return (
    <CalendarLayout>
      <CalendarPlaceholder />
    </CalendarLayout>
  )
}