import { ModalProps } from 'antd'

import { Database } from '@types'

export interface IDragItemProps {
	appointment: Database['public']['Tables']['appointments']['Row'] & { users: TUsersJoin }
}

type TUsersJoin = {
	id: string
	email: string
} | null

export interface IDropZoneProps {
	accepts: Database['public']['Enums']['apt_status'][]
	className?: string
	title: string
	columnStatus: Database['public']['Enums']['apt_status']
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
	status: Database['public']['Enums']['apt_status'] | null
}

interface IEditAppointmentModalProps {
	mode: 'edit'
	appointmentId: string | null
	schoolId?: never
	status?: never
}

interface IViewAppointmentModalProps {
	mode: 'view'
	appointmentId: string | null
	schoolId?: never
	status?: never
}

export interface INewModalProps {
	schoolId: string | null
	status: Database['public']['Enums']['apt_status'] | null
}
