import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const where = session.user.role === 'ADMIN'
    ? { assignmentId: id }
    : { assignmentId: id, studentId: session.user.id }

  const submissions = await prisma.submission.findMany({
    where,
    include: {
      student: { select: { id: true, name: true, email: true, cohort: true } },
      assignment: { select: { id: true, title: true, maxScore: true } },
    },
    orderBy: { submittedAt: 'desc' },
  })

  return NextResponse.json(submissions)
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { submissionText, fileUrl, fileName } = await req.json()

  const assignment = await prisma.assignment.findUnique({ where: { id } })
  if (!assignment) return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })

  if (new Date() > assignment.dueDate) {
    return NextResponse.json({ error: 'Deadline has passed' }, { status: 400 })
  }

  const submission = await prisma.submission.upsert({
    where: {
      assignmentId_studentId: {
        assignmentId: id,
        studentId: session.user.id,
      },
    },
    update: {
      submissionText,
      fileUrl,
      fileName,
      submittedAt: new Date(),
      status: 'PENDING',
      score: null,
      feedback: null,
    },
    create: {
      assignmentId: id,
      studentId: session.user.id,
      submissionText,
      fileUrl,
      fileName,
    },
  })

  return NextResponse.json(submission, { status: 201 })
}
