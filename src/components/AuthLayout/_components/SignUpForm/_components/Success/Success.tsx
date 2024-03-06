import { EnvelopeSimple as EnvelopeIcon } from '@phosphor-icons/react'
import { App, Button, Col, Grid, Row, Space, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useSupabase } from '@utils'

import './Success-styles.less'

const { useBreakpoint } = Grid

export function Success() {
	const [isButtonDisabled, setIsButtonDisabled] = useState(false)
	const [remainingTime, setRemainingTime] = useState(60)
	const supabase = useSupabase()
	const { message } = App.useApp()
	const screens = useBreakpoint()
	const [params] = useSearchParams()

	useEffect(() => {
		let timer: NodeJS.Timeout

		if (isButtonDisabled) {
			timer = setInterval(() => {
				setRemainingTime((prevTime) => prevTime - 1)
			}, 1000)
		} else {
			setRemainingTime(60)
		}

		return () => {
			if (timer) {
				clearInterval(timer)
			}
		}
	}, [isButtonDisabled])

	const resendMail = async () => {
		const email = params.get('email') as string

		const { error } = await supabase.auth.resend({
			type: 'signup',
			email,
			options: { emailRedirectTo: 'http://localhost:5173' },
		})

		if (error) {
			console.error(error)
			message.error(`${error.name}: ${error.message}`, 7.5)
		} else {
			setIsButtonDisabled(true)
			message.success('Email de confirmation envoyé.')
			setTimeout(() => {
				setIsButtonDisabled(false)
			}, 60_000)
		}
	}

	const gridGutter = { xs: 10, sm: 18, md: 26, lg: 34 } as const

	const getSpan = (): { main: number; spacer: number } => {
		if (screens.xl) {
			return { main: 16, spacer: 4 }
		} else if (screens.lg) {
			return { main: 20, spacer: 2 }
		} else {
			return {
				main: 22,
				spacer: 1,
			}
		}
	}

	const getParagraphSpan = (): { main: number; spacer: number } => {
		if (screens.xl) {
			return { main: 14, spacer: 5 }
		} else if (screens.lg) {
			return { main: 16, spacer: 4 }
		} else {
			return {
				main: 18,
				spacer: 3,
			}
		}
	}

	const span = getSpan()
	const paragraphSpan = getParagraphSpan()

	return (
		<Row className="sign-up-success" gutter={[gridGutter, gridGutter]}>
			<Col span={24}>
				<Space direction="vertical" size="middle">
					<Row>
						<Col span={span.spacer}></Col>
						<Col span={span.main}>
							<div className="sign-up-success__title">
								<EnvelopeIcon size={64} />
								<Typography.Title>Confirmez votre email</Typography.Title>
							</div>
						</Col>
						<Col span={span.spacer}></Col>
					</Row>

					<Row>
						<Col span={paragraphSpan.spacer}></Col>
						<Col span={paragraphSpan.main}>
							<Typography.Paragraph className="sign-up-success__paragraph">
								Vérifiez votre boîte mail et cliquez sur le lien pour confirmer votre email. Vous
								pourrez accéder à votre compte une fois qu'un administrateur aura validé votre
								inscription.
							</Typography.Paragraph>
						</Col>
						<Col span={paragraphSpan.spacer}></Col>
					</Row>

					<Row>
						<Col span={span.spacer}></Col>
						<Col span={span.main}>
							<div className="sign-up-success__resend-container">
								<Typography.Paragraph className="sign-up-success__resend-txt">
									Vous n'avez pas reçu de mail ?
								</Typography.Paragraph>
								<Button
									type="link"
									className="sign-up-success__resend-btn"
									onClick={() => resendMail()}
									disabled={isButtonDisabled}
								>
									{isButtonDisabled ? `Renvoyer (${remainingTime}s)` : 'Renvoyer'}
								</Button>
							</div>
						</Col>
						<Col span={span.spacer}></Col>
					</Row>
				</Space>
			</Col>
		</Row>
	)
}
