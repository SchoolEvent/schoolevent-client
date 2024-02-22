import { useQuery } from '@tanstack/react-query'
import { Skeleton } from 'antd'
import { useMemo } from 'react'

import { LoadingError } from '@components'
import { useSupabase } from '@utils'

import { Modal } from '../../../Modal/Modal'
import { Form } from '../Form/Form'
import { IFormValues } from '../Form/Form-types'
import { IViewModalProps } from './ViewModal-types'

export function ViewModal(props: IViewModalProps) {
	const { appointmentId } = props

	const supabase = useSupabase()

	// Fetch appointment
	const {
		data: appointment,
		isLoading,
		isSuccess,
		error,
	} = useQuery({
		queryKey: ['appointment', { appointmentId }],
		queryFn: async () => {
			if (!appointmentId) {
				throw new Error('appointmentId is required')
			}

			const { data, error } = await supabase
				.from('appointments')
				.select()
				.eq('id', appointmentId)
				.single()

			if (error) {
				throw error
			}

			return data
		},
	})

	const formKey = useMemo(() => {
		return isSuccess ? 'view-apt-form' : 'view-apt-form-loading'
	}, [isSuccess])

	const initialValues: Partial<IFormValues> | undefined = useMemo(() => {
		if (appointment) {
			return {
				apt_status: appointment.apt_status,
				apt_type: appointment.apt_type,
				school_name: appointment.school_name,
				school_address: appointment.school_address,
				school_postal_code: appointment.school_postal_code,
				school_city: appointment.school_city,
				contact_name: appointment.contact_name,
				contact_phone: appointment.contact_phone,
				contact_email: appointment.contact_email,
				assignee: appointment.assignee,
				note: appointment.note,
				attachements: appointment.attachements,
				contacted_date: appointment.contacted_date ?? undefined,
				planned_date: appointment.planned_date ?? undefined,
			} as Partial<IFormValues>
		} else {
			return undefined
		}
	}, [appointment])

	return (
		<Modal
			className="appointment-modal appointment-modal--view"
			title={isLoading ? <Skeleton.Input active /> : appointment?.school_name}
		>
			{error ? (
				<LoadingError error={error.message} />
			) : (
				<Form key={formKey} isLoading={isLoading} initialValues={initialValues} mode="view" />
			)}
		</Modal>
	)
}
