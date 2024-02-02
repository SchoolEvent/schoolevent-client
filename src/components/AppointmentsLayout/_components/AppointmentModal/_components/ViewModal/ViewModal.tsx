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
	const { data, isLoading, isSuccess, error } = useQuery({
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
		if (data) {
			const appointment = data

			return {
				apt_status: appointment.apt_status,
				school_name: appointment.school_name,
				school_address: appointment.school_address,
				school_postal_code: appointment.school_postal_code,
				school_city: appointment.school_city,
				contact_phone: appointment.contact_phone,
				contact_email: appointment.contact_email,
			} as Partial<IFormValues>
		} else {
			return undefined
		}
	}, [data])

	return (
		<Modal
			className="appointment-modal appointment-modal--view"
			title={isLoading ? <Skeleton.Input active /> : data?.school_name}
		>
			{error ? (
				<LoadingError error={error.message} />
			) : (
				<Form key={formKey} isLoading={isLoading} initialValues={initialValues} mode="view" />
			)}
		</Modal>
	)
}
