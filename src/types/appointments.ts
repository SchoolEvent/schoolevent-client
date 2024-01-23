export const appointmentStatusRecord = {
	TO_CONTACT: 'to_contact',
	CONTACTED: 'contacted',
	PLANNED: 'planned',
	DONE: 'done',
} as const

export type TAppointmentStatus =
	(typeof appointmentStatusRecord)[keyof typeof appointmentStatusRecord]

export interface IAppointment {
	id: number
	school_name: string
	status: TAppointmentStatus
	created_at: string
}
