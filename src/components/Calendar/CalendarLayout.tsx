import { Layout } from 'antd'

import { Calendar, CalendarList } from './_components'

import './CalendarLayout-styles.less'

const { Content, Header, Sider } = Layout

export function CalendarLayout() {
	return (
		<Layout className="calendar-layout">
			<Header>Calendrier</Header>
			<Layout>
				<Sider width={250}>
					<CalendarList />
				</Sider>
				<Content>
					<Calendar />
				</Content>
			</Layout>
		</Layout>
	)
}
