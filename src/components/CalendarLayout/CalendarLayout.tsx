import { BasicLayout } from '@components'

import { Calendar, CalendarList } from './_components'

import './CalendarLayout-styles.less'

export function CalendarLayout() {
	return (
		<BasicLayout
			className="calendar-layout"
			contentClassName="calendar-layout__content"
			sider={<CalendarList />}
		>
			<Calendar />
		</BasicLayout>
	)
}
