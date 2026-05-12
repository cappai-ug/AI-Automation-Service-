import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

export async function GET(request: NextRequest) {
  const apiKey = process.env.SENDGRID_API_KEY
  const fromEmail = process.env.SENDGRID_FROM_EMAIL

  console.log('=== SendGrid Debug Info ===')
  console.log('API Key exists:', !!apiKey)
  console.log('API Key length:', apiKey ? apiKey.length : 0)
  console.log('API Key first 10 chars:', apiKey ? apiKey.substring(0, 10) : 'N/A')
  console.log('From Email:', fromEmail)

  if (!apiKey || !fromEmail) {
    return NextResponse.json(
      {
        error: 'Missing configuration',
        apiKey: !!apiKey,
        fromEmail: !!fromEmail,
      },
      { status: 400 }
    )
  }

  sgMail.setApiKey(apiKey)

  const msg = {
    to: 'niklas-schalinsky@hotmail.de',
    from: fromEmail,
    subject: 'Test Email from OPTIMIZED',
    html: '<h1>Test Email</h1><p>If you see this, SendGrid works!</p>',
  }

  try {
    console.log('Attempting to send test email...')
    const response = await sgMail.send(msg)
    console.log('✅ Success! Response status:', response[0].statusCode)

    return NextResponse.json({
      success: true,
      statusCode: response[0].statusCode,
      message: 'Email sent! Check your inbox (including spam)',
    })
  } catch (error: any) {
    console.error('❌ SendGrid Error:', error.message)
    console.error('Full error:', error)

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
