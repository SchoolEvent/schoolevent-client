import { ArrowLeft as BackIcon, ShieldWarning as ShieldIcon } from '@phosphor-icons/react'
import { Button, Typography } from 'antd'

import { useSupabase } from '@utils'

import './NotApproved-styles.less'

export function NotApproved() {
	const supabase = useSupabase()

	const onClickFn = async () => await supabase.auth.signOut()

	return (
		<main className="not-approved">
			<Typography.Text type="danger">
				<ShieldIcon size={64} />
			</Typography.Text>
			<Typography.Title className="not-approved__title" type="danger">
				Accès refusé
			</Typography.Title>
			<Typography.Paragraph>
				Votre compte n'est pas approuvé. Veuillez contacter votre administrateur.
			</Typography.Paragraph>
			<Button
				className="not-approved__btn"
				type="primary"
				icon={<BackIcon size={16} weight="bold" />}
				onClick={onClickFn}
			>
				Retour à la page de connexion
			</Button>
		</main>
	)
}
