export interface Service {
  id:           string
  name:         string
  slug:         string
  description:  string | null
  duration_min: number
  price_min:    number
  price_max:    number | null
  is_active:    boolean
  sort_order:   number
  created_at:   string
  updated_at:   string
}

export interface Appointment {
  id:             string
  service_id:     string
  client_name:    string
  client_email:   string
  client_phone:   string
  start_at:       string
  end_at:         string
  status:         AppointmentStatus
  gcal_event_id:  string | null
  gcal_link:      string | null
  notes:          string | null
  confirmed_at:   string | null
  cancelled_at:   string | null
  cancel_reason:  string | null
  created_at:     string
  updated_at:     string
}

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed'

export interface BlockedPeriod {
  id:         string
  title:      string
  start_at:   string
  end_at:     string
  type:       'vacation' | 'day_off' | 'other'
  created_at: string
}

export interface BusinessConfig {
  id:         string
  key:        string
  value:      unknown
  updated_at: string
}

export interface WorkingHours {
  [day: string]: {
    open:   boolean
    start?: string
    end?:   string
  }
}