import { ModalProps } from 'antd'

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

export interface IModalProps extends Omit<ModalProps, 'open' | 'centered' | 'onCancel'> {
	onCancelCallback?: () => void
}

export type TAppointmentModalProps =
	| INewAppointmentModalProps
	| IEditAppointmentModalProps
	| IViewAppointmentModalProps

interface INewAppointmentModalProps {
	mode: 'new'
	appointmentId?: never
	schoolId: string | null
}

interface IEditAppointmentModalProps {
	mode: 'edit'
	appointmentId: string | null
	schoolId?: never
}

interface IViewAppointmentModalProps {
	mode: 'view'
	appointmentId: string | null
	schoolId?: never
}
