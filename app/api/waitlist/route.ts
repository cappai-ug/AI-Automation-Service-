import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, company, useCase } = body

    if (!email || !company || !useCase) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // TODO: Implement Google Sheets integration
    // For now, we'll log the data and return success
    // Instructions for Google Sheets integration are below:

    // Option 1: Google Sheets with Apps Script
    // 1. Create a Google Form connected to a Sheet
    // 2. Get the form action URL
    // 3. Submit data to the Google Form

    // Option 2: Google Sheets API
    // 1. Create a service account with Sheets API access
    // 2. Use GOOGLE_SHEETS_API_KEY and SPREADSHEET_ID env vars
    // 3. Append rows programmatically

    const timestamp = new Date().toISOString()
    console.log('Waitlist signup:', { email, company, useCase, timestamp })

    // Example: Append to Google Sheets via Apps Script
    // const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL
    // if (googleScriptUrl) {
    //   await fetch(googleScriptUrl, {
    //     method: 'POST',
    //     body: JSON.stringify({ email, company, useCase, timestamp })
    //   })
    // }

    return NextResponse.json(
      { success: true, message: 'Added to waitlist' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
