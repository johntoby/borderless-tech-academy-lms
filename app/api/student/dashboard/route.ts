import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [courses, upcomingAssignments, mySubmissions, announcements] = await Promise.all([
    prisma.course.findMany({
      where: { isPublished: true },
      take: 4,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.assignment.findMany({
      where: { dueDate: { gte: new Date() } },
      include: { course: { select: { title: true } } },
      orderBy: { dueDate: 'asc' },
      take: 5,
    }),
    prisma.submission.findMany({
      where: { studentId: session.user.id },
      select: { assignmentId: true, status: true, score: true },
    }),
    prisma.announcement.findMany({
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
  ])

  return NextResponse.json({ courses, upcomingAssignments, mySubmissions, announcements })
}
