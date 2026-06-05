import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const assignments = await prisma.assignment.findMany({
    include: {
      course: { select: { id: true, title: true, cohort: true } },
      _count: { select: { submissions: true } },
    },
    orderBy: { dueDate: 'asc' },
  })

  return NextResponse.json(assignments)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { courseId, title, description, dueDate, maxScore } = await req.json()
  if (!courseId || !title || !description || !dueDate) {
    return NextResponse.json({ error: 'courseId, title, description, and dueDate are required' }, { status: 400 })
  }

  const assignment = await prisma.assignment.create({
    data: {
      courseId,
      title,
      description,
      dueDate: new Date(dueDate),
      maxScore: maxScore || 100,
    },
    include: { course: { select: { id: true, title: true } } },
  })

  return NextResponse.json(assignment, { status: 201 })
}
