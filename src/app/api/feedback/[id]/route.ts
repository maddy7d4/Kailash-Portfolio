import { NextRequest, NextResponse } from 'next/server'
import { updateFeedback, deleteFeedback } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { name, designation, brandName, feedback, stars, pros, cons } = body
    const { id } = await params

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

    const updatedFeedback = await updateFeedback(id, {
      name,
      designation,
      brandName,
      feedback,
      stars,
      pros: pros || undefined,
      cons: cons || undefined,
    })

    if (!updatedFeedback) {
      return NextResponse.json(
        { success: false, error: 'Feedback not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: updatedFeedback })
  } catch (error) {
    console.error('Error updating feedback:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update feedback' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const deleted = await deleteFeedback(id)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Feedback not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: 'Feedback deleted successfully' })
  } catch (error) {
    console.error('Error deleting feedback:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete feedback' },
      { status: 500 }
    )
  }
}
