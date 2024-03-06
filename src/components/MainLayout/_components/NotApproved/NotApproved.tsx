import { ShieldWarning as ShieldIcon } from '@phosphor-icons/react'
import { Button, Typography } from 'antd'

import { useSupabase } from '@utils'

import './NotApproved-styles.less'

export function NotApproved() {
	const supabase = useSupabase()

	const onClickFn = async () => await supabase.auth.signOut()

	return (
		<main className="not-approved">
			<ShieldIcon size={64} />
			<Typography.Title className="not-approved__title">Accès refusé</Typography.Title>
			<Typography.Paragraph>
				Votre compte n'est pas approuvé. Veuillez contacter votre administrateur.
			</Typography.Paragraph>
			<Button className="not-approved__btn" type="primary" onClick={onClickFn}>
				Retour à la page de connexion
			</Button>
		</main>
	)
}
