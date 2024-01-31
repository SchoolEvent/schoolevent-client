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

export interface IAppointmentModalProps {
	appointmentId: Database['public']['Tables']['appointments']['Row']['id']
	mode: 'edit' | 'view'
}

export interface INewAppointmentModalProps {
	school_id: Database['public']['Tables']['favorites']['Row']['school_id']
}
