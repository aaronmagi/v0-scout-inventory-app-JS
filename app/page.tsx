import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"

export default function Home() {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Sidebar />
      <Dashboard />
    </div>
  )
}
