import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string; contentId: string }> }) {
  const { contentId } = await params
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()
  const content = await prisma.content.update({
    where: { id: contentId },
    data,
  })

  return NextResponse.json(content)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string; contentId: string }> }) {
  const { contentId } = await params
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.content.delete({ where: { id: contentId } })
  return NextResponse.json({ success: true })
}
