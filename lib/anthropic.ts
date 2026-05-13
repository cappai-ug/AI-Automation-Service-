import Anthropic from '@anthropic-ai/sdk'

let client: Anthropic | undefined

export function getAnthropic(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set')
    }
    client = new Anthropic({ apiKey })
  }
  return client
}

export const DRAFT_MODEL = 'claude-opus-4-7'
