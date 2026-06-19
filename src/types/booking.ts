import type { Service } from './database'

export interface TimeSlot {
  start: string
  end:   string
  label: string
}

export interface BookingStep {
  service:  Service | null
  date:     string | null
  timeSlot: TimeSlot | null
  client: {
    name:  string
    phone: string
    email: string
    notes: string
  } | null
}

export interface CreateAppointmentInput {
  service_id:   string
  client_name:  string
  client_email: string
  client_phone: string
  start_at:     string
  notes?:       string
}

export interface CreateAppointmentResponse {
  id:        string
  gcal_link: string | null
}

export interface AvailabilityResponse {
  slots: TimeSlot[]
}

export interface ApiError {
  error: string
}