import { Button, Form, Input } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useSupabase } from '@utils'

import { ILoginFormFields } from '../types'

export function LoginForm() {
	const [isSubmittable, setIsSubmittable] = useState(false)
	const [form] = Form.useForm()
	const supabase = useSupabase()
	const navigate = useNavigate()

	const onFinish = async (values: ILoginFormFields) => {
		const { email, password } = values

		if (!email || !password) return

		const { error } = await supabase.auth.signInWithPassword({ email, password })

		if (error) {
			console.error(error)
			return
		}

		form.resetFields()

		navigate('/')
	}

	const values = Form.useWatch([], form)

	useEffect(() => {
		form.validateFields({ validateOnly: true }).then(
			() => {
				setIsSubmittable(true)
			},
			() => {
				setIsSubmittable(false)
			},
		)
	}, [values])

	return (
		<Form
			form={form}
			name="login"
			size="large"
			layout="vertical"
			autoComplete="off"
			onFinish={onFinish}
			initialValues={{ email: '', password: '' }}
		>
			<Form.Item<ILoginFormFields>
				label="Email"
				name="email"
				validateFirst
				rules={[
					{ required: true, message: 'Veuillez saisir votre email.' },
					() => ({
						validator(_, value) {
							const regexp = new RegExp(/^[a-zA-Z.]+@(edu\.)?esiee-it\.fr$/)

							if (regexp.test(value)) {
								return Promise.resolve()
							}

							return Promise.reject(new Error('Veuillez saisir votre email étudiant.'))
						},
					}),
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
				<Button htmlType="submit" type="primary" block disabled={!isSubmittable}>
					Connexion
				</Button>
			</Form.Item>
		</Form>
	)
}
