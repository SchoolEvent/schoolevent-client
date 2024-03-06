import { Alert, Button, Form, Input } from 'antd'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useSupabase } from '@utils'

import { ILoginFormFields } from '../types'
import { parseLoginError } from './LoginForm-utils'

import './LoginForm-styles.less'

export function LoginForm() {
	const [error, setError] = useState<null | string>(null)
	const [form] = Form.useForm()
	const supabase = useSupabase()

	const onFinish = async (values: ILoginFormFields) => {
		const { email, password } = values

		if (!email || !password) return

		const { error } = await supabase.auth.signInWithPassword({ email, password })

		if (error) {
			console.error(error)
			const parsedMessage = parseLoginError(error.message)

			parsedMessage && setError(parsedMessage)

			return
		}
	}

	return (
		<Form
			form={form}
			className="login-form"
			name="login"
			size="large"
			layout="vertical"
			autoComplete="off"
			onFinish={onFinish}
			initialValues={{ email: '', password: '' }}
			requiredMark={false}
			onChange={() => {
				if (error) {
					setError(null)
				}
			}}
		>
			{error && <Alert className="login-form__alert" type="error" message={error} showIcon />}
			<Form.Item<ILoginFormFields>
				label="Email"
				name="email"
				validateFirst
				rules={[
					{ type: 'email', message: 'Veuillez saisir un email valide.' },
					{ required: true, message: 'Veuillez saisir votre email.' },
				]}
			>
				<Input />
			</Form.Item>

			<Form.Item<ILoginFormFields>
				label="Mot de passe"
				name="password"
				rules={[{ required: true, message: 'Veuillez saisir votre mot de passe.' }]}
			>
				<Input.Password />
			</Form.Item>

			<Form.Item>
				<Button htmlType="submit" type="primary" block>
					Se connecter
				</Button>
			</Form.Item>

			<span className="form-footer-link">
				Vous n'avez pas encore de compte ? <Link to="/auth/sign-up">Inscrivez-vous.</Link>
			</span>
		</Form>
	)
}
