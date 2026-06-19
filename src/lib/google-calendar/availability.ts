import { getCalendarClient } from './client'

export interface BusySlot {
  start: Date
  end: Date
}

export async function getGCalBusySlots(date: string): Promise<BusySlot[]> {
  const calendar = getCalendarClient()

  const dayStart = new Date(`${date}T00:00:00-03:00`)
  const dayEnd   = new Date(`${date}T23:59:59-03:00`)

  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin: dayStart.toISOString(),
      timeMax: dayEnd.toISOString(),
      items: [{ id: process.env.GOOGLE_CALENDAR_ID ?? 'primary' }]
    }
  })

  const calendars = response.data.calendars
  if (!calendars) return []

  const calendarId = process.env.GOOGLE_CALENDAR_ID ?? 'primary'
  const busy = calendars[calendarId]?.busy ?? []

  return busy
    .filter(slot => slot.start && slot.end)
    .map(slot => ({
      start: new Date(slot.start!),
      end:   new Date(slot.end!)
    }))
}