import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const contentType = request.headers.get('content-type') ?? ''
    if (!contentType.includes('multipart/form-data') && !contentType.includes('application/x-www-form-urlencoded')) {
        return NextResponse.json({ error: 'Request must be multipart/form-data' }, { status: 400 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
        return NextResponse.json({ error: 'File size must be under 5MB' }, { status: 400 })
    }

    const blob = await put(file.name, file, { access: 'public' })

    return NextResponse.json({ url: blob.url })
}
