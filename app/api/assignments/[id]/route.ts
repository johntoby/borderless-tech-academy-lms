import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const assignment = await prisma.assignment.findUnique({
    where: { id: params.id },
    include: {
      course: { select: { id: true, title: true, cohort: true } },
      submissions: {
        include: {
          student: { select: { id: true, name: true, email: true, cohort: true } },
        },
        orderBy: { submittedAt: 'desc' },
      },
    },
  })

  if (!assignment) return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })

  return NextResponse.json(assignment)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()
  if (data.dueDate) data.dueDate = new Date(data.dueDate)

  const assignment = await prisma.assignment.update({
    where: { id: params.id },
    data,
  })

  return NextResponse.json(assignment)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.assignment.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
