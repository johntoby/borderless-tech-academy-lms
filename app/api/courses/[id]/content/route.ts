import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const content = await prisma.content.findMany({
    where: { courseId: params.id },
    orderBy: { order: 'asc' },
  })

  return NextResponse.json(content)
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, type, url, description, order } = await req.json()
  if (!title || !type || !url) {
    return NextResponse.json({ error: 'Title, type, and URL are required' }, { status: 400 })
  }

  const content = await prisma.content.create({
    data: { courseId: params.id, title, type, url, description, order: order || 0 },
  })

  return NextResponse.json(content, { status: 201 })
}
