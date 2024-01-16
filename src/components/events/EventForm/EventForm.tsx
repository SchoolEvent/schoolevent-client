import { UploadOutlined } from '@ant-design/icons'
import { Button, DatePicker, Form, Input, Select, TimePicker, Upload } from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import dayjs from 'dayjs'

import { useSupabase } from '@utils'

import { IEventFormFields } from '../type'
import { eventTypesRecord } from './EventForm-types'

export function EventForm() {
	const [form] = Form.useForm()

	const formatDate = 'DD/MM/YYYY'
	const date = dayjs(Date.now())
	const formatTime = 'HH:mm'
	const supabase = useSupabase()

	const createEvent = async (value: IEventFormFields) => {
		let backgroundUrl: string | null = null

		if (value.event_background && value.event_background.file) {
			const { data, error } = await supabase.storage
				.from('pictures')
				.upload(value.event_background.file.name, value.event_background.file)

			backgroundUrl = error !== null ? null : data?.path
		}

		await supabase.from('events').insert({
			...value,
			event_background: backgroundUrl,
			event_time: dayjs(value.event_time).format(formatTime),
		})
	}

	return (
		<Form
			form={form}
			name="event"
			size="large"
			layout="vertical"
			autoComplete="off"
			initialValues={{
				event_name: '',
				event_position: '',
				event_background: '',
				event_date: date,
				event_time: date,
				event_type: '',
				event_description: '',
			}}
			onFinish={createEvent}
		>
			<Form.Item<IEventFormFields>
				label="Nom de l'événement"
				name="event_name"
				rules={[{ required: true, message: "Veuillez saisir un nom d'évenement." }]}
			>
				<Input />
			</Form.Item>

			<Form.Item<IEventFormFields>
				label="Type d'événement"
				name="event_type"
				rules={[{ required: true, message: 'Veuillez sélectionner le type de votre événement.' }]}
			>
				<Select
					placeholder="Sélectionner un type d'événement"
					options={Object.entries(eventTypesRecord).map(
						([key, label]) => ({ label, value: key }) as DefaultOptionType,
					)}
				/>
			</Form.Item>

			<Form.Item<IEventFormFields>
				label="Lieux"
				name="event_position"
				rules={[{ required: true, message: 'Veuillez saisir le lieux de votre événement.' }]}
			>
				<Input />
			</Form.Item>

			<Form.Item<IEventFormFields>
				label="Description de l'événement"
				name="event_description"
				rules={[{ required: true, message: "Veuillez saisir une description d'évenement." }]}
			>
				<Input />
			</Form.Item>

			<Form.Item<IEventFormFields>
				label="Date de l'événement"
				name="event_date"
				rules={[{ required: true, message: 'Veuillez saisir la date de votre événement.' }]}
			>
				<DatePicker format={formatDate} />
			</Form.Item>

			<Form.Item<IEventFormFields>
				label="Heure de l'événement"
				name="event_time"
				rules={[
					{
						required: true,
						message: "Veuillez saisir l'heure de début et de fin de votre événement.",
					},
				]}
			>
				<TimePicker format={formatTime} />
			</Form.Item>

			<Form.Item<IEventFormFields> label="Image de fond" name="event_background">
				<Upload beforeUpload={() => false}>
					<Button icon={<UploadOutlined />}>Sélectionner une image</Button>
				</Upload>
			</Form.Item>

			<Form.Item>
				<Button htmlType="submit" type="primary" block>
					Créer l'événement
				</Button>
			</Form.Item>
		</Form>
	)
}
