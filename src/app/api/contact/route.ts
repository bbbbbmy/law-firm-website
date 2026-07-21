import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const zhContact = await prisma.contactInfo.findUnique({
      where: { language: 'zh' },
    })
    const enContact = await prisma.contactInfo.findUnique({
      where: { language: 'en' },
    })

    return NextResponse.json({
      zh: zhContact,
      en: enContact,
    })
  } catch (error) {
    console.error('Error fetching contact info:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact info' },
      { status: 500 }
    )
  }
}
