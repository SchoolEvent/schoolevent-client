import { BasicLayout, FavoritesList } from '@components'

import { useController } from './AppointmentsLayout-controller'
import { DropZone } from './_components'

import './AppointmentsLayout-styles.less'

export function AppointmentsLayout() {
	const { renderModal } = useController()

	return (
		<BasicLayout
			className="appointments-layout"
			sider={<FavoritesList />}
			contentClassName="appointments-content"
		>
			<div className="drop-zones-container">
				{renderModal()}
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
