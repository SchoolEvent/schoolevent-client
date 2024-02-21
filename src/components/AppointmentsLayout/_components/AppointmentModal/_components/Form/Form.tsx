import { Plus as PlusIcon, Check as SaveIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import {
	Form as AntdForm,
	AutoComplete,
	Button,
	Col,
	Divider,
	Input,
	Row,
	Select,
	Skeleton,
	Tabs,
	Typography,
} from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Info } from '@components'
import {
	fetchAddressCompletion,
	fetchGeoIP,
	getNameFromEmail,
	useDebounce,
	useSupabase,
} from '@utils'

import { appointmentStatusRecord } from '../../../../../../types/appointments'
import { DateField } from '../DateField/DateField'
import { IFormValues, TFormProps, submitButtonLabel } from './Form-types'

dayjs.extend(utc)
dayjs.extend(timezone)

export function Form(props: TFormProps) {
	const { isLoading, isPending, onFinish, initialValues, mode } = props

	const [form] = AntdForm.useForm()
	const [addressSearch, setAddressSearch] = useState(initialValues?.school_address ?? '')
	const debouncedSearch = useDebounce(addressSearch, 500)

	const supabase = useSupabase()
	const navigate = useNavigate()

	const { data: userLocation } = useQuery({ queryKey: ['user-geoip'], queryFn: fetchGeoIP })

	const { data: addressCompletion } = useQuery({
		queryKey: ['addresse-completion', { search: debouncedSearch }],
		queryFn: async () =>
			await fetchAddressCompletion(
				debouncedSearch,
				userLocation,
				form.getFieldValue('school_postal_code'),
			),
		enabled: !!debouncedSearch && !!userLocation,
		initialData: [],
	})

	const { data: assignees, isFetching } = useQuery({
		queryKey: ['assignees'],
		queryFn: async () => {
			const { data, error } = await supabase.from('users').select('id,email').eq('role', 'manager')

			if (error) {
				throw error
			}

			return data
		},
		placeholderData: [],
		staleTime: 1000 * 10,
	})

	if (initialValues?.apt_status === 'contacted' && !initialValues?.contacted_date) {
		initialValues.contacted_date = dayjs().tz().toISOString()
	}

	if (initialValues?.apt_status === 'planned' && !initialValues?.planned_date) {
		initialValues.planned_date = dayjs().tz().toISOString()
	}

	// TODO: set the form to read only if the mode is view
	return (
		<AntdForm<IFormValues>
			// Changing the key of an element in React will force it to re-render.
			//
			// In our case, the form won't re-render when the data is fetched, so we
			// need to force it to re-render by changing its key.
			className="appointment-modal__form"
			layout="vertical"
			form={form}
			onFinish={onFinish}
			initialValues={initialValues}
		>
			<Row>
				<Col span={12}>
					<Tabs
						defaultActiveKey="1"
						items={[
							{
								key: 'required_fields',
								label: 'Établissement',
								forceRender: true,
								children: (
									<>
										<AntdForm.Item
											name="school_name"
											label="Établissement"
											rules={[{ required: true }]}
										>
											{isLoading ? <Skeleton.Input active block /> : <Input allowClear />}
										</AntdForm.Item>

										<AntdForm.Item
											name="school_address"
											label="Adresse"
											rules={[{ required: true }]}
										>
											{isLoading ? (
												<Skeleton.Input active block />
											) : (
												<AutoComplete
													value={addressSearch}
													onSearch={(value) => setAddressSearch(value)}
													onSelect={(value) => setAddressSearch(value)}
													options={addressCompletion?.map((address) => ({
														label: address.label,
														value: address.name,
													}))}
												/>
											)}
										</AntdForm.Item>

										<AntdForm.Item
											name="school_postal_code"
											label="Code postal"
											rules={[{ required: true }]}
										>
											{isLoading ? <Skeleton.Input active block /> : <Input allowClear />}
										</AntdForm.Item>
										<AntdForm.Item name="school_city" label="Ville" rules={[{ required: true }]}>
											{isLoading ? <Skeleton.Input active block /> : <Input allowClear />}
										</AntdForm.Item>
									</>
								),
							},
							{
								key: 'optional_fields',
								label: 'Contact',
								forceRender: true,
								children: (
									<>
										<AntdForm.Item name="contact_name" label="Nom du contact">
											{isLoading ? <Skeleton.Input active block /> : <Input allowClear />}
										</AntdForm.Item>

										<AntdForm.Item name="contact_phone" label="Téléphone">
											{isLoading ? <Skeleton.Input active block /> : <Input allowClear />}
										</AntdForm.Item>

										<AntdForm.Item name="contact_email" label="Email">
											{isLoading ? <Skeleton.Input active block /> : <Input allowClear />}
										</AntdForm.Item>
									</>
								),
							},
							{
								key: 'notes_field',
								label: 'Note',
								forceRender: true,
								children: (
									<AntdForm.Item name="note" label="Note">
										{isLoading ? (
											<Skeleton.Input active block />
										) : (
											<Input.TextArea autoSize={{ minRows: 13, maxRows: 13 }} allowClear />
										)}
									</AntdForm.Item>
								),
							},
						]}
					/>
				</Col>

				<Col
					span={2}
					style={{
						padding: 'var(--ant-padding-sm) 0',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Divider type="vertical" style={{ height: '100%' }} />
				</Col>

				<Col span={10}>
					<AntdForm.Item name="assignee" label="Assigné">
						{isLoading ? (
							<Skeleton.Input active block />
						) : (
							<Select
								loading={isFetching}
								showSearch
								filterOption={(input, option) => {
									if (!option) return false

									return option.label.toLowerCase().includes(input.toLowerCase())
								}}
								options={assignees?.map((assignee) => {
									const { name } = getNameFromEmail(assignee.email)

									return {
										label: `${name} (${assignee.email})`,
										title: `${name} (${assignee.email})`,
										value: assignee.id,
									}
								})}
								allowClear
							/>
						)}
					</AntdForm.Item>
					<AntdForm.Item
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
					</AntdForm.Item>

					<AntdForm.Item name="apt_type" label="Type de rendez-vous">
						{isLoading ? <Skeleton.Input active block /> : <Input allowClear />}
					</AntdForm.Item>

					<AntdForm.Item
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
							<DateField
								value={form.getFieldValue('contacted_date')}
								viewMode={mode === 'view'}
								block
							/>
						)}
					</AntdForm.Item>

					<AntdForm.Item
						name="planned_date"
						label={
							<div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ant-margin-xs)' }}>
								<Typography.Text>Planifié le</Typography.Text>
								<Info tooltip>
									<span>La date à laquelle le rendez-vous est prévu.</span>
								</Info>
							</div>
						}
					>
						{isLoading ? (
							<Skeleton.Input active block />
						) : (
							<DateField
								value={form.getFieldValue('planned_date')}
								viewMode={mode === 'view'}
								block
							/>
						)}
					</AntdForm.Item>
				</Col>
			</Row>

			<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="appointment-modal__form__footer">
				<Col span={mode !== 'view' ? 10 : 24}>
					<AntdForm.Item>
						<Button
							onClick={() => {
								navigate('/appointments')
							}}
							block
						>
							Annuler
						</Button>
					</AntdForm.Item>
				</Col>
				{mode !== 'view' && (
					<Col span={14}>
						<AntdForm.Item>
							<Button
								className="appointment-modal__form__footer__submit-button"
								htmlType="submit"
								type="primary"
								icon={mode === 'new' ? <PlusIcon size={16} /> : <SaveIcon size={16} />}
								disabled={isLoading}
								loading={isPending}
								block
							>
								{submitButtonLabel[mode]}
							</Button>
						</AntdForm.Item>
					</Col>
				)}
			</Row>
		</AntdForm>
	)
}
