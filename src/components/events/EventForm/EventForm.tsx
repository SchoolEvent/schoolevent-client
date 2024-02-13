import { UploadOutlined } from '@ant-design/icons'
import { Button, DatePicker, Form, Input, Select, TimePicker, Upload } from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import dayjs from 'dayjs'
import short from 'short-uuid'

import { useAuth } from '@contexts'
import { useSupabase } from '@utils'

import { IEventFormFields, eventTypesRecord } from './EventForm-types'
import { getFileExtension } from './EventForm-utils'

export function EventForm() {
	const translator = short()
	const [form] = Form.useForm()
	const { user } = useAuth()

	const formatDate = 'DD/MM/YYYY'
	const date = dayjs(Date.now())
	const formatTime = 'HH:mm'
	const supabase = useSupabase()

	const createEvent = async (value: IEventFormFields) => {
		const { event_background, ...values } = value

		let backgroundUrl: string | null = null

		if (event_background?.file) {
			const fileExtension = getFileExtension(event_background.file.name)
			const fileId = translator.new()

			const { data, error } = await supabase.storage
				.from('pictures')
				.upload(`background_${fileId}.${fileExtension}`, event_background.file)

			backgroundUrl = error ? null : data.path
		}

		await supabase.from('events').insert({
			...values,
			event_creator_id: user?.id ?? null,
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
				<Upload beforeUpload={() => false} accept="image/png, image/jpeg">
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
