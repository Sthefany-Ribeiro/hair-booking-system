import { getCalendarClient } from './client'

interface CreateEventInput {
  summary:     string
  description: string
  startAt:     Date
  endAt:       Date
}

interface CreatedEvent {
  id:       string
  htmlLink: string
}

export async function createCalendarEvent(
  input: CreateEventInput
): Promise<CreatedEvent> {
  const calendar = getCalendarClient()

  const response = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID ?? 'primary',
    requestBody: {
      summary:     input.summary,
      description: input.description,
      colorId:     '5',
      start: {
        dateTime: input.startAt.toISOString(),
        timeZone: 'America/Sao_Paulo'
      },
      end: {
        dateTime: input.endAt.toISOString(),
        timeZone: 'America/Sao_Paulo'
      }
    }
  })

  return {
    id:       response.data.id!,
    htmlLink: response.data.htmlLink!
  }
}

export async function updateCalendarEvent(
  eventId: string,
  summary: string
): Promise<void> {
  const calendar = getCalendarClient()

  await calendar.events.patch({
    calendarId: process.env.GOOGLE_CALENDAR_ID ?? 'primary',
    eventId,
    requestBody: {
      summary,
      colorId: '2'
    }
  })
}

export async function deleteCalendarEvent(eventId: string): Promise<void> {
  const calendar = getCalendarClient()

  await calendar.events.delete({
    calendarId: process.env.GOOGLE_CALENDAR_ID ?? 'primary',
    eventId
  })
}