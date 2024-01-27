import { TAppointmentStatus } from '@types'

export interface IDragItemProps {
	appointment: {
		id: number
		school_name: string
		status: string
		created_at: string
	}
}

export interface IDropZoneProps {
	accepts: TAppointmentStatus[]
	className?: string
	title: string
	columnStatus: TAppointmentStatus
}

export interface IModalProps {
	appointmentId: string
}
