import { Info as InfoIcon } from '@phosphor-icons/react'
import { Button, Form, Input } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useSupabase } from '@utils'

import { IMagicLinkFormFields } from '../types'

import './MagicLinkForm-styles.less'

export function MagicLinkForm() {
	const [buttonLabel, setButtonLabel] = useState<string>('Envoyer le lien')
	const [form] = Form.useForm()
	const supabase = useSupabase()
	const navigate = useNavigate()

	const inDevMode = import.meta.env.DEV

	const sendLink = async (values: IMagicLinkFormFields) => {
		const { email } = values

		if (!email) return

		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				shouldCreateUser: true,
				emailRedirectTo: inDevMode ? 'http://localhost:5173/' : 'https://schoolevent.app/',
			},
		})

		if (error) {
			console.error(error)
		}
	}

	const verifyCode = async (values: IMagicLinkFormFields) => {
		const { email, confirmCode } = values

		if (!email || !confirmCode) return

		const { error } = await supabase.auth.verifyOtp({ email, token: confirmCode, type: 'email' })

		if (error) {
			console.error(error)
			return
		}

		navigate('/')
	}

	const onFinish = async (values: IMagicLinkFormFields) => {
		const { email, confirmCode } = values

		if (!email) return

		if (confirmCode === '') {
			await sendLink(values)
		} else {
			await verifyCode(values)
		}
	}

	return (
		<Form
			form={form}
			name="magiclink"
			size="large"
			layout="vertical"
			autoComplete="off"
			onFinish={onFinish}
			initialValues={{ email: '', confirmCode: '' }}
		>
			<Form.Item<IMagicLinkFormFields>
				label="Email"
				name="email"
				rules={[{ required: true, message: 'Veuillez saisir votre email.' }]}
			>
				<Input />
			</Form.Item>

			<Form.Item
				label="Confirmation code"
				name="confirmCode"
				extra={
					<p>
						<InfoIcon size="1rem" />
						Si le lien ne redirige pas vers la dashboard, entrez le code reçu avec le lien.
					</p>
				}
			>
				<Input
					onChange={(e) => {
						if (e.target.value === '') {
							setButtonLabel('Envoyer le lien')
						} else {
							setButtonLabel('Valider le code')
						}
					}}
				/>
			</Form.Item>

			<Form.Item>
				<Button htmlType="submit" type="primary" block>
					{buttonLabel}
				</Button>
			</Form.Item>
		</Form>
	)
}
