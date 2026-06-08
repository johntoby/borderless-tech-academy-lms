import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { StudentSidebar } from '@/components/layout/student-sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')
  if (session.user.role === 'ADMIN') redirect('/admin/dashboard')

  return (
    <div className="flex min-h-screen bg-[#0A0F1E]">
      <StudentSidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
