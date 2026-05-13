import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

export const dynamic = 'force-dynamic'

export async function GET(_request: NextRequest) {
  if (process.env.ENABLE_SENDGRID_TEST !== 'true') {
    return NextResponse.json(
      { error: 'Disabled. Set ENABLE_SENDGRID_TEST=true to enable.' },
      { status: 404 }
    )
  }

  const apiKey = process.env.SENDGRID_API_KEY
  const fromEmail = process.env.SENDGRID_FROM_EMAIL
  const toEmail = process.env.SENDGRID_TEST_TO || fromEmail

  console.log('=== SendGrid Debug Info ===')
  console.log('API Key exists:', !!apiKey)
  console.log('API Key length:', apiKey ? apiKey.length : 0)
  console.log('From Email:', fromEmail)
  console.log('To Email:', toEmail)

  if (!apiKey || !fromEmail || !toEmail) {
    return NextResponse.json(
      {
        error: 'Missing configuration',
        apiKey: !!apiKey,
        fromEmail: !!fromEmail,
        toEmail: !!toEmail,
      },
      { status: 400 }
    )
  }

  sgMail.setApiKey(apiKey)

  const msg = {
    to: toEmail,
    from: fromEmail,
    subject: 'Test Email from OPTIMIZED',
    html: '<h1>Test Email</h1><p>If you see this, SendGrid works!</p>',
  }

  try {
    const response = await sgMail.send(msg)
    return NextResponse.json({
      success: true,
      statusCode: response[0].statusCode,
      message: 'Email sent! Check your inbox (including spam)',
    })
  } catch (error: any) {
    console.error('SendGrid Error:', error.message)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        errorCode: error.code,
        details: error.response?.body || 'No response body',
      },
      { status: 500 }
    )
  }
}
