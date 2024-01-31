import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import { BasicLayout, FavoritesList } from '@components'

import { DropZone, Modal } from './_components'

import './AppointmentsLayout-styles.less'

export function AppointmentsLayout() {
	const [params, setParams] = useSearchParams()

	const id = params.get('id')
	const isIdValid = !!(id && !Number.isNaN(Number(id)))

	useEffect(() => {
		if (id && !isIdValid) {
			params.delete('id')
			setParams(params)
		}
	}, [id, isIdValid, params, setParams])

	return (
		<BasicLayout
			className="appointments-layout"
			sider={<FavoritesList />}
			contentClassName="appointments-content"
		>
			<div className="drop-zones-container">
				{isIdValid && <Modal appointmentId={Number(id)} />}
				<DropZone
					title="À contacter"
					columnStatus="to_contact"
					accepts={['contacted', 'planned', 'done']}
					className="drop-zone__to-contact"
				/>
				<DropZone
					title="Contacté"
					columnStatus="contacted"
					accepts={['to_contact', 'planned', 'done']}
					className="drop-zone__contacted"
				/>
				<DropZone
					title="Rendez-vous planifié"
					columnStatus="planned"
					accepts={['to_contact', 'contacted', 'done']}
					className="drop-zone__planned"
				/>
				<DropZone
					title="Bilan"
					columnStatus="done"
					accepts={['to_contact', 'contacted', 'planned']}
					className="drop-zone__done"
				/>
			</div>
		</BasicLayout>
	)
}
