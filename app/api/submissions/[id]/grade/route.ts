import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { score, feedback } = await req.json()
  if (score === undefined || score === null) {
    return NextResponse.json({ error: 'Score is required' }, { status: 400 })
  }

  const submission = await prisma.submission.update({
    where: { id: params.id },
    data: { score, feedback, status: 'REVIEWED' },
    include: {
      student: { select: { id: true, name: true, email: true } },
      assignment: { select: { id: true, title: true, maxScore: true } },
    },
  })

  return NextResponse.json(submission)
}
