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

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const { language, address, phone, email, wechatQrUrl, serviceQrUrl, mapUrl } = data

    const contact = await prisma.contactInfo.upsert({
      where: { language },
      update: {
        address,
        phone,
        email,
        wechatQrUrl,
        serviceQrUrl,
        mapUrl,
      },
      create: {
        language,
        address,
        phone,
        email,
        wechatQrUrl,
        serviceQrUrl,
        mapUrl,
      },
    })

    return NextResponse.json(contact)
  } catch (error) {
    console.error('Error updating contact info:', error)
    return NextResponse.json(
      { error: 'Failed to update contact info' },
      { status: 500 }
    )
  }
}
