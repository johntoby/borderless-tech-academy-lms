import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const onlyPublished = session.user.role === 'STUDENT'

  const courses = await prisma.course.findMany({
    where: onlyPublished ? { isPublished: true } : {},
    include: {
      _count: { select: { content: true, assignments: true } },
    },
    orderBy: [{ cohort: 'asc' }, { weekNumber: 'asc' }],
  })

  return NextResponse.json(courses)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, description, cohort, weekNumber, isPublished } = await req.json()
  if (!title || !description || !cohort) {
    return NextResponse.json({ error: 'Title, description, and cohort are required' }, { status: 400 })
  }

  const course = await prisma.course.create({
    data: { title, description, cohort, weekNumber: weekNumber || 1, isPublished: isPublished ?? false },
  })

  return NextResponse.json(course, { status: 201 })
}
