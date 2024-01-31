import { Database } from '@types'

export interface IDragItemProps {
	appointment: Database['public']['Tables']['appointments']['Row']
}

export interface IDropZoneProps {
	accepts: Database['public']['Enums']['appointment_status'][]
	className?: string
	title: string
	columnStatus: Database['public']['Enums']['appointment_status']
}

export interface IModalProps {
	appointmentId: Database['public']['Tables']['appointments']['Row']['id']
}
