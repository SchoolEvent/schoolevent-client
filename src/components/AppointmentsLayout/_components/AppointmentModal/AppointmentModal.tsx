import { TAppointmentModalProps } from '../../AppointmentsLayout-types'
import { EditModal, NewModal, ViewModal } from './_components'

import './AppointmentModal-styles.less'

export function AppointmentModal(props: TAppointmentModalProps) {
	const { mode, appointmentId, schoolId, status } = props

	if (mode === 'view') {
		return <ViewModal appointmentId={appointmentId} />
	} else if (mode === 'edit') {
		return <EditModal appointmentId={appointmentId} />
	}

	return <NewModal schoolId={schoolId} status={status} />
}
