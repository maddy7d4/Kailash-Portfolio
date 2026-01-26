import { NextRequest, NextResponse } from 'next/server'
import { getFeedback, saveFeedback } from '@/lib/db'

export async function GET() {
  try {
    const feedbacks = await getFeedback()
    return NextResponse.json({ success: true, data: feedbacks })
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, designation, brandName, feedback, stars, pros, cons } = body

    // Validation
    if (!name || !designation || !brandName || !feedback || stars === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (stars < 1 || stars > 5) {
      return NextResponse.json(
        { success: false, error: 'Stars must be between 1 and 5' },
        { status: 400 }
      )
    }

    const newFeedback = await saveFeedback({
      name,
      designation,
      brandName,
      feedback,
      stars,
      pros: pros || undefined,
      cons: cons || undefined,
    })

    return NextResponse.json({ success: true, data: newFeedback }, { status: 201 })
  } catch (error) {
    console.error('Error saving feedback:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save feedback' },
      { status: 500 }
    )
  }
}
