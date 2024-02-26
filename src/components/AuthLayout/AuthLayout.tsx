import { Card } from 'antd'

import { LoginForm } from './_components'

import './AuthLayout-styles.less'

export function AuthLayout() {
	return (
		<div className="login-container">
			<div className="login-container__hero">
				<img src="schoolevent_logo_white.svg" />
				<img src="schoolevent_text_white.svg" />
				<p>
					Le CRM <span>rapide</span> et <span>intuitif</span> dédié aux écoles.
				</p>
			</div>
			<div className="login-container__form">
				<Card title={<h2>Connexion</h2>}>
					<LoginForm />
				</Card>
			</div>
		</div>
	)
}
