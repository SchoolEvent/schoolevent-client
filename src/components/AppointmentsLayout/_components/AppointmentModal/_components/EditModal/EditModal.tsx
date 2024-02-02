import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App, Skeleton } from 'antd'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { LoadingError } from '@components'
import { useSupabase } from '@utils'

import { Modal } from '../../../Modal/Modal'
import { Form } from '../Form/Form'
import { IFormValues } from '../Form/Form-types'

export function EditModal({ appointmentId }: { appointmentId: string | null }) {
	const supabase = useSupabase()
	const queryClient = useQueryClient()
	const navigate = useNavigate()
	const { notification } = App.useApp()

	// Update appointment
	const { mutate, isPending } = useMutation({
		mutationFn: async (values: IFormValues) => {
			if (!appointmentId) {
				throw new Error('appointmentId is required')
			}

			const { data, error } = await supabase
				.from('appointments')
				.update(values)
				.eq('id', appointmentId)

			if (error) {
				throw error
			}

			return data
		},
		onError: (error) => {
			notification.error({ message: error.message, duration: 5 })
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['appointment', { appointmentId }],
			})
			queryClient.invalidateQueries({
				queryKey: ['appointments'],
			})
			notification.success({ message: 'Rendez-vous modifié avec succès', duration: 5 })
			navigate('/appointments')
		},
	})

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
		return isSuccess ? 'new-apt-form' : 'new-apt-form-loading'
	}, [isSuccess])

	const initialValues: Partial<IFormValues> | undefined = useMemo(() => {
		return data
	}, [data])

	return (
		<Modal
			className="appointment-modal appointment-modal--edit"
			title={isLoading ? <Skeleton.Input active /> : data?.school_name}
		>
			{error ? (
				<LoadingError error={error.message} />
			) : (
				<Form
					key={formKey}
					isLoading={isLoading}
					isPending={isPending}
					onFinish={mutate}
					initialValues={initialValues}
					mode="edit"
				/>
			)}
		</Modal>
	)
}
