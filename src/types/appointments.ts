import { Database } from './supabase'

export const appointmentStatusRecord = {
	to_contact: 'À contacter',
	contacted: 'Contacté',
	planned: 'Rendez-vous planifié',
	done: 'Bilan',
} as const

export type TAppointmentStatus = Database['public']['Enums']['apt_status']

export type TAppointment = Database['public']['Tables']['appointments']['Row']
