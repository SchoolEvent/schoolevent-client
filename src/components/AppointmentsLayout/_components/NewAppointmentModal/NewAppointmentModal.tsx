import { Plus as PlusIcon } from '@phosphor-icons/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	Button,
	DatePicker,
	Divider,
	Form,
	Input,
	Select,
	Skeleton,
	Typography,
	message,
} from 'antd'
import locale from 'antd/lib/date-picker/locale/fr_FR'

import { Info } from '@components'
import { appointmentStatusRecord } from '@types'
import { useSupabase } from '@utils'

import {
	GOUV_API_URL,
	SELECTED_FIELDS,
} from '../../../ContactsLayout/_components/Table/Table-constants'
import { INewAppointmentModalProps } from '../../AppointmentsLayout-types'
import { Modal } from '../Modal/Modal'
import { IFormValues } from './NewAppointmentModal-types'

import './NewAppointmentModal-styles.less'

export function NewAppointmentModal(props: INewAppointmentModalProps) {
	const { school_id } = props

	const supabase = useSupabase()
	const queryClient = useQueryClient()
	const [form] = Form.useForm()

	const { mutate, isPending } = useMutation({
		mutationFn: async (values: IFormValues) => {
			const { data, error } = await supabase.from('appointments').insert(values)

			if (error) {
				throw error
			}

			return data
		},
		onError: (error) => {
			message.error(error.message, 7)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['appointments'] })
			message.success('Le rendez-vous a bien été créé.')
		},
	})

	// Fetch school data by id
	const { data, isLoading } = useQuery({
		queryKey: ['school', school_id],
		queryFn: async () =>
			fetch(
				`${GOUV_API_URL}?timezone=Europe%2FParis&where=identifiant_de_l_etablissement="${school_id}"&select=${SELECTED_FIELDS}`,
			).then((res) => res.json()),
	})

	return (
		<Modal title="Nouveau rendez-vous" className="new-appointment-modal">
			<Form<IFormValues>
				// Changing the key of an element in React will force it to re-render.
				//
				// In our case, the form won't re-render when the data is fetched, so we
				// need to force it to re-render by changing its key.
				key={`new-appointment-form${isLoading ? '__loading' : ''}`}
				className="new-appointment-modal__form"
				layout="vertical"
				form={form}
				onFinish={mutate}
				initialValues={{
					apt_status: 'to_contact',
					school_name: data?.results[0].nom_etablissement,
					school_address: data?.results[0].adresse_1,
					school_postal_code: data?.results[0].code_postal,
					school_city: data?.results[0].nom_commune,
					contact_phone: data?.results[0].telephone,
					contact_email: data?.results[0].mail,
				}}
			>
				<div className="new-appointment-modal__form__status-and-type">
					<Form.Item
						name="apt_status"
						label="Status"
						rules={[{ required: true, message: 'Veuillez sélectionner un status.' }]}
					>
						{isLoading ? (
							<Skeleton.Input active block />
						) : (
							<Select
								options={Object.entries(appointmentStatusRecord).map(([key, value]) => ({
									key,
									label: value,
									value: key,
								}))}
								allowClear
							/>
						)}
					</Form.Item>

					<Form.Item name="apt_type" label="Type de rendez-vous">
						{isLoading ? <Skeleton.Input active block /> : <Input allowClear />}
					</Form.Item>
				</div>

				<Divider />

				<Form.Item name="school_name" label="Établissement" rules={[{ required: true }]}>
					{isLoading ? <Skeleton.Input active block /> : <Input allowClear />}
				</Form.Item>

				<Form.Item name="school_address" label="Adresse" rules={[{ required: true }]}>
					{isLoading ? <Skeleton.Input active block /> : <Input allowClear />}
				</Form.Item>

				<div className="new-appointment-modal__form__postal-code-and-city">
					<Form.Item name="school_postal_code" label="Code postal" rules={[{ required: true }]}>
						{isLoading ? <Skeleton.Input active block /> : <Input allowClear />}
					</Form.Item>
					<Form.Item name="school_city" label="Ville" rules={[{ required: true }]}>
						{isLoading ? <Skeleton.Input active block /> : <Input allowClear />}
					</Form.Item>
				</div>

				<Form.Item name="contact_name" label="Nom du contact">
					{isLoading ? <Skeleton.Input active block /> : <Input allowClear />}
				</Form.Item>

				<div className="new-appointment-modal__form__phone-and-mail">
					<Form.Item name="contact_phone" label="Téléphone">
						{isLoading ? <Skeleton.Input active block /> : <Input allowClear />}
					</Form.Item>

					<Form.Item name="contact_email" label="Email">
						{isLoading ? <Skeleton.Input active block /> : <Input allowClear />}
					</Form.Item>
				</div>

				<Divider />

				<div className="new-appointment-modal__form__contacted-and-planned-date">
					<Form.Item
						name="contacted_date"
						label={
							<div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ant-margin-xs)' }}>
								<Typography.Text>Contacté le</Typography.Text>
								<Info tooltip>
									<span>
										La date à laquelle vous avez contacté l'établissement pour la première fois.
									</span>
								</Info>
							</div>
						}
					>
						{isLoading ? (
							<Skeleton.Input active block />
						) : (
							<DatePicker
								style={{ width: '100%' }}
								locale={locale}
								format="DD/MM/YYYY"
								allowClear
							/>
						)}
					</Form.Item>

					<Form.Item
						name="planned_date"
						label={
							<div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ant-margin-xs)' }}>
								<Typography.Text>Plannifié le</Typography.Text>
								<Info tooltip>
									<span>La date à laquelle le rendez-vous est prévu.</span>
								</Info>
							</div>
						}
					>
						{isLoading ? (
							<Skeleton.Input active block />
						) : (
							<DatePicker
								style={{ width: '100%' }}
								locale={locale}
								format="DD/MM/YYYY HH:mm"
								showTime={{
									showHour: true,
									showMinute: true,
									showSecond: false,
									format: 'HH:mm',
								}}
								allowClear
							/>
						)}
					</Form.Item>
				</div>

				<Form.Item>
					<Button
						className="new-appointment-modal__form__submit-button"
						htmlType="submit"
						type="primary"
						icon={<PlusIcon size={16} />}
						disabled={isLoading}
						loading={isPending}
						block
					>
						Créer le rendez-vous
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	)
}
