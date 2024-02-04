import { Plus as PlusIcon } from '@phosphor-icons/react'
import {
	Form as AntdForm,
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

import { Info } from '@components'

import { appointmentStatusRecord } from '../../../../../../types/appointments'
import { DateField } from '../DateField/DateField'
import { IFormValues, TFormProps, submitButtonLabel } from './Form-types'

dayjs.extend(utc)
dayjs.extend(timezone)

export function Form(props: TFormProps) {
	const { isLoading, isPending, onFinish, initialValues, mode } = props

	if (initialValues?.apt_status === 'contacted' && !initialValues?.contacted_date) {
		initialValues.contacted_date = dayjs().tz().toISOString()
	}

	if (initialValues?.apt_status === 'planned' && !initialValues?.planned_date) {
		initialValues.planned_date = dayjs().tz().toISOString()
	}

	const [form] = AntdForm.useForm()

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
				<Col span={14}>
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
											{isLoading ? <Skeleton.Input active block /> : <Input allowClear />}
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
											<Input.TextArea autoSize allowClear />
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

				<Col span={8}>
					{/** TODO: once the api is ready, implement the assignee search */}
					<AntdForm.Item name="assignee" label="Assigné">
						{isLoading ? <Skeleton.Input active block /> : <Select disabled />}
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

			{mode !== 'view' && (
				<AntdForm.Item>
					<Button
						className="appointment-modal__form__submit-button"
						htmlType="submit"
						type="primary"
						icon={mode === 'new' ? <PlusIcon /> : undefined}
						disabled={isLoading}
						loading={isPending}
						block
					>
						{submitButtonLabel[mode]}
					</Button>
				</AntdForm.Item>
			)}
		</AntdForm>
	)
}
