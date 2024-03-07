import { SignIn as SignUpIcon } from '@phosphor-icons/react'
import { useMutation } from '@tanstack/react-query'
import { App, Button, Form, Input } from 'antd'
import { Link, useNavigate } from 'react-router-dom'

import { isStringEmpty, useSupabase } from '@utils'

import { ISignUpFormFields } from '../types'
import { handleSuccessfulRedirect } from './SignUpForm-utils'

import './SignUpForm-styles.less'

export function SignUpForm() {
	const [form] = Form.useForm()
	const supabase = useSupabase()
	const navigate = useNavigate()
	const { message } = App.useApp()

	const { mutate, isPending } = useMutation({
		mutationFn: async (values: ISignUpFormFields) => {
			const { email, password } = values

			if (!email || !password) return

			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: { emailRedirectTo: 'http://localhost:5173' },
			})

			if (error) {
				console.error(error)
				message.error(`${error.name}: ${error.message}`, 7.5)
				return
			}

			return data
		},
		onError: (error) => {
			console.error(error)
			message.error(`${error.name}: ${error.message}`, 7.5)
		},
		onSuccess: (data) => {
			console.log(data)
			handleSuccessfulRedirect(data?.user, navigate)
		},
	})

	return (
		<Form
			className="sign-up-form"
			form={form}
			name="login"
			size="large"
			layout="vertical"
			autoComplete="off"
			onFinish={mutate}
			initialValues={{ email: '', password: '', confirmPassword: '' }}
		>
			<Form.Item<ISignUpFormFields>
				label="Email"
				name="email"
				validateFirst
				rules={[
					{ type: 'email', message: 'Veuillez saisir votre email ESIEE-IT.' },
					{ required: true, message: 'Veuillez saisir votre email ESIEE-IT.' },
					() => ({
						validator(_, value) {
							const regexp = new RegExp(/@(edu\.)?esiee-it\.fr$/)

							if (regexp.test(value)) {
								return Promise.resolve()
							}

							return Promise.reject(new Error('Veuillez saisir votre email ESIEE-IT.'))
						},
					}),
				]}
			>
				<Input />
			</Form.Item>

			<Form.Item<ISignUpFormFields>
				label="Mot de passe"
				name="password"
				hasFeedback
				rules={[
					{ required: true, message: 'Veuillez saisir votre mot de passe.' },
					({ getFieldValue }) => ({
						validator(_, value) {
							if (!value || getFieldValue('password').length >= 6) {
								return Promise.resolve()
							}

							return Promise.reject(new Error('Le mot de passe doit avoir 6 caractères minimum.'))
						},
					}),
				]}
			>
				<Input.Password
					onChange={() => {
						if (isStringEmpty(form.getFieldValue('confirmPassword'))) {
							return
						}

						form.validateFields()
					}}
				/>
			</Form.Item>

			<Form.Item<ISignUpFormFields>
				label="Confirmer votre mot de passe"
				name="confirmPassword"
				hasFeedback
				rules={[
					{
						required: true,
						message: 'Veuillez confirmer votre mot de passe.',
					},
					({ getFieldValue }) => ({
						validator(_, value) {
							if (!value || getFieldValue('password') === value) {
								return Promise.resolve()
							}

							return Promise.reject(new Error('Le mot de passe ne correspond pas.'))
						},
					}),
				]}
			>
				<Input.Password />
			</Form.Item>

			<Form.Item>
				<Button
					className="sign-up-form__submit-btn"
					htmlType="submit"
					type="primary"
					loading={isPending}
					icon={<SignUpIcon size={16} weight="bold" />}
					block
				>
					S'inscrire
				</Button>
			</Form.Item>

			<span className="form-footer-link">
				Vous êtes déjà inscrit ? <Link to="/auth/login">Connectez-vous.</Link>
			</span>
		</Form>
	)
}
