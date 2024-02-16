import { BasicLayout } from '@components'

import { Form } from './_components/Form/Form'

import './EventForm-styles.less'

export function EventForm() {
	return (
		<BasicLayout
			className="event-form-layout"
			contentClassName="event-form-layout__content"
			// sider={<ShortEventsList />}
		>
			<Form />
		</BasicLayout>
	)
}
