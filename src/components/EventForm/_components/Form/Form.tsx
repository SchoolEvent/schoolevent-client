import { UploadOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import {
	Form as AntdForm,
	AutoComplete,
	Button,
	Col,
	ConfigProvider,
	DatePicker,
	Divider,
	Input,
	InputNumber,
	Row,
	Select,
	Typography,
	Upload,
	theme as themeAlg,
} from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import short from 'short-uuid'

import { IconButton } from '@components'
import { useAuth, useTheme } from '@contexts'
import { fetchAddressCompletion, fetchGeoIP, useDebounce, useSupabase } from '@utils'

import { IEventFormFields, eventTypesRecord } from '../../EventForm-types'
import { getFileExtension } from '../../EventForm-utils'
import { getFilePathFromUrl } from './Form-utils'

dayjs.extend(utc)
dayjs.extend(timezone)

export function Form() {
	const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null)
	const [eventTitle, setEventTitle] = useState("Titre de l'événement")
	const [addressSearch, setAddressSearch] = useState('')
	const debouncedSearch = useDebounce(addressSearch, 500)
	const [form] = AntdForm.useForm()
	const { user, session } = useAuth()
	const { theme } = useTheme()
	const supabase = useSupabase()
	const navigate = useNavigate()
	const translator = short()

	const { data: userLocation } = useQuery({ queryKey: ['user-geoip'], queryFn: fetchGeoIP })

	const formatDate = 'DD/MM/YYYY à HH:mm'

	const { data: addressCompletion } = useQuery({
		queryKey: ['addresse-completion', { search: debouncedSearch }],
		queryFn: async () => await fetchAddressCompletion(debouncedSearch, userLocation),
		enabled: !!debouncedSearch && !!userLocation,
		initialData: [],
	})

	const createEvent = async (value: IEventFormFields) => {
		await supabase.from('events').insert({
			...value,
			event_creator_id: user!.id,
			event_background: backgroundUrl,
			event_date: dayjs(value.event_date).tz().toISOString(),
			event_duration: value.event_duration * 60 * 60,
		})
	}

	const removeBackground = useCallback(async () => {
		if (!backgroundUrl) {
			return true
		}

		const { error } = await supabase.storage
			.from('pictures')
			.remove([getFilePathFromUrl(backgroundUrl)])

		if (error === null) {
			setBackgroundUrl(null)
		}

		return error ? false : true
	}, [supabase, backgroundUrl])

	return (
		<AntdForm
			className="event-form"
			form={form}
			name="event"
			size="large"
			layout="vertical"
			autoComplete="off"
			initialValues={{
				event_duration: 1.0,
				event_title: '',
				event_address: '',
				event_school_name: '',
				event_background: '',
				event_date: '',
				event_description: '',
			}}
			onFinish={createEvent}
		>
			<div
				className="event-form__header"
				style={{
					backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
					backgroundColor: 'var(--ant-layout-sider-bg)',
				}}
			>
				<ConfigProvider
					theme={{
						algorithm: theme === 'light' ? themeAlg.darkAlgorithm : themeAlg.defaultAlgorithm,
					}}
				>
					<AntdForm.Item<IEventFormFields>
						name="event_title"
						rules={[{ required: true, message: "Veuillez saisir un nom d'évenement." }]}
						className="event-title-input"
					>
						<Typography.Title
							level={2}
							editable={{
								onChange: (value) => {
									setEventTitle(value)
									form.setFieldValue('event_title', value)
								},
							}}
						>
							{eventTitle}
						</Typography.Title>
					</AntdForm.Item>

					<AntdForm.Item<IEventFormFields>
						name="event_background"
						className="upload-background-btn"
					>
						<Upload
							customRequest={async ({ file, onSuccess, onError, onProgress }) => {
								if (file instanceof File) {
									const fileExtension = getFileExtension(file.name)
									const fileId = translator.new()

									const req = new XMLHttpRequest()
									req.upload.onprogress = (event) => {
										onProgress?.({ percent: (event.loaded / event.total) * 100 })
									}
									req.upload.onerror = (event) => {
										onError?.(event)
										console.error('error', event)
									}
									req.upload.onload = () => {
										onSuccess?.('ok')
									}

									req.open(
										'POST',
										`${
											import.meta.env.VITE_SUPABASE_URL
										}/storage/v1/object/pictures/background_${fileId}.${fileExtension}`,
									)

									req.setRequestHeader('Authorization', `Bearer ${session?.access_token}`)
									if (fileExtension) {
										req.setRequestHeader(
											'Content-Type',
											`image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`,
										)
									}

									req.send(file)

									// when the request is successful, we can set the backgroundUrl
									req.onreadystatechange = () => {
										if (req.readyState === 4 && req.status === 200) {
											const publicUrl = `${
												import.meta.env.VITE_SUPABASE_URL
											}/storage/v1/object/public/pictures/background_${fileId}.${fileExtension}`
											setBackgroundUrl(publicUrl)
										}
									}
								}
							}}
							onRemove={removeBackground}
							accept="image/png, image/jpeg"
						>
							<IconButton type="text" icon={<UploadOutlined />} />
						</Upload>
					</AntdForm.Item>
				</ConfigProvider>
			</div>
			<div className="event-form__body">
				<Divider>Quand</Divider>
				<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
					<Col span={9}>
						<AntdForm.Item<IEventFormFields>
							label="Date de l'événement"
							name="event_date"
							rules={[{ required: true, message: 'Veuillez saisir la date de votre événement.' }]}
						>
							<DatePicker format={formatDate} showTime />
						</AntdForm.Item>
					</Col>
					<Col span={5}>
						<AntdForm.Item<IEventFormFields>
							label="Durée"
							name="event_duration"
							rules={[
								{
									required: true,
									message: "Veuillez saisir la durée de l'événement.",
								},
							]}
						>
							<InputNumber addonAfter="h" step={0.5} />
						</AntdForm.Item>
					</Col>
					<Col span={10}>
						<AntdForm.Item<IEventFormFields>
							label="Type d'événement"
							name="event_type"
							rules={[
								{ required: true, message: 'Veuillez sélectionner le type de votre événement.' },
							]}
						>
							<Select
								placeholder="Sélectionner un type"
								options={Object.entries(eventTypesRecord).map(
									([key, label]) => ({ label, value: key }) as DefaultOptionType,
								)}
							/>
						</AntdForm.Item>
					</Col>
				</Row>
				<Divider>Où</Divider>
				<AntdForm.Item<IEventFormFields>
					label="Adresse"
					name="event_address"
					rules={[{ required: true, message: "Veuillez saisir l'adresse de votre événement." }]}
				>
					<AutoComplete
						onSearch={(value) => setAddressSearch(value)}
						onSelect={(value) => setAddressSearch(value)}
						options={addressCompletion.map((address) => ({ label: address, value: address }))}
					/>
				</AntdForm.Item>

				<AntdForm.Item<IEventFormFields>
					label="Établissement"
					name="event_school_name"
					rules={[{ required: true, message: "Veuillez saisir le nom de l'établissement." }]}
				>
					<Input />
				</AntdForm.Item>

				<Divider>Description</Divider>
				<AntdForm.Item<IEventFormFields>
					// label="Description de l'événement"
					name="event_description"
					rules={[{ required: true, message: "Veuillez saisir une description d'évenement." }]}
				>
					<Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
				</AntdForm.Item>
			</div>
			<div className="event-form__footer">
				<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
					<Col span={10}>
						<AntdForm.Item>
							<Button onClick={() => navigate('/events')} block>
								Annuler
							</Button>
						</AntdForm.Item>
					</Col>
					<Col span={14}>
						<AntdForm.Item>
							<Button htmlType="submit" type="primary" block>
								Créer l'événement
							</Button>
						</AntdForm.Item>
					</Col>
				</Row>
			</div>
		</AntdForm>
	)
}
