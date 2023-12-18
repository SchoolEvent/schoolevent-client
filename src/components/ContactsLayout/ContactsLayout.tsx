import { Layout } from 'antd'

import { FavoritesList, Table } from './_components'

import './ContactsLayout-styles.less'

import Map from '../Map/Map'

const { Content, Header, Sider } = Layout

export function ContactsLayout() {
	return (
		<Layout className="contacts-layout">
			<Header>Search, filters, sorting...</Header>
			<Layout>
				<Sider width={250}>
					<FavoritesList />
				</Sider>
				<Content>
					<Table />
					<Map />
				</Content>
			</Layout>
		</Layout>
	)
}
