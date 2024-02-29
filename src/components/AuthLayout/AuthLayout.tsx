import { Card } from 'antd'

import { LoginForm } from './_components'

import './AuthLayout-styles.less'

export function AuthLayout() {
	return (
		<div className="auth-layout">
			<header className="auth-layout__hero">
				<div className="auth-layout__hero__logo-container">
					<img
						className="auth-layout__hero__logo-container__logo"
						src="schoolevent_logo_white.svg"
						alt="SchoolEvent logo"
					/>
					<img
						className="auth-layout__hero__logo-container__text"
						src="schoolevent_text_white.svg"
						alt="SchoolEvent text logo"
					/>
				</div>
				<p>
					Le CRM <span>rapide</span> et <span>intuitif</span> dédié aux écoles.
				</p>
			</header>
			<div className="auth-layout__content">
				<Card title={<h2>Connexion</h2>}>
					<LoginForm />
				</Card>
			</div>
		</div>
	)
}
