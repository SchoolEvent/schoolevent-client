import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useSupabase } from '@utils'

import {
	GOUV_API_URL,
	SELECTED_FIELDS,
} from '../../../../../ContactsLayout/_components/Table/Table-constants'
import { ISchool } from '../../../../../ContactsLayout/_components/Table/Table-types'
import { INewModalProps } from '../../../../AppointmentsLayout-types'
import { Modal } from '../../../Modal/Modal'
import { Form } from '../Form/Form'
import { IFormValues } from '../Form/Form-types'

export function NewModal(props: INewModalProps) {
	const { schoolId, status } = props

	const supabase = useSupabase()
	const queryClient = useQueryClient()
	const navigate = useNavigate()
	const { notification } = App.useApp()

	// Create appointment
	const { mutate, isPending } = useMutation({
		mutationFn: async (values: IFormValues) => {
			const { data, error } = await supabase.from('appointments').insert(values)

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
				queryKey: ['appointments'],
			})
			notification.success({ message: 'Rendez-vous créé avec succès', duration: 5 })
			navigate('/appointments')
		},
	})

	// Fetch appointment
	const { data, isLoading, isSuccess } = useQuery({
		queryKey: ['school', { schoolId }],
		queryFn: async () =>
			fetch(
				`${GOUV_API_URL}?timezone=Europe%2FParis&where=identifiant_de_l_etablissement="${schoolId}"&select=${SELECTED_FIELDS}`,
			).then((res) => res.json()),
	})

	const formKey = useMemo(() => {
		return isSuccess ? 'new-apt-form' : 'new-apt-form-loading'
	}, [isSuccess])

	const initialValues: Partial<IFormValues> | undefined = useMemo(() => {
		if (data?.results[0]) {
			const school = data.results[0] as ISchool

			return {
				apt_status: status ? status : 'to_contact',
				school_name: school.nom_etablissement,
				school_address: school.adresse_1,
				school_postal_code: school.code_postal,
				school_city: school.nom_commune,
				contact_phone: school.telephone,
				contact_email: school.mail,
			} as Partial<IFormValues>
		} else {
			return { apt_status: status ? status : 'to_contact' }
		}
	}, [data, status])

	return (
		<Modal className="appointment-modal appointment-modal--new" title="Nouveau rendez-vous">
			<Form
				key={formKey}
				isLoading={isLoading}
				isPending={isPending}
				onFinish={mutate}
				initialValues={initialValues}
				mode="new"
			/>
		</Modal>
	)
}
