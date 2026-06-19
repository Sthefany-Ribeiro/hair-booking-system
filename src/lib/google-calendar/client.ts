import { google } from 'googleapis'

export function getGoogleAuthClient() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )

  auth.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  })

  return auth
}

export function getCalendarClient() {
  const auth = getGoogleAuthClient()
  return google.calendar({ version: 'v3', auth })
}