import { MagnifyingGlass as SearchIcon } from '@phosphor-icons/react'
import { Input, Layout, Space } from 'antd'
import { useLayoutEffect, useState } from 'react'

import { Info } from '@components'
import { useDebounce } from '@utils'

import { FavoritesList, Table } from './_components'

import './ContactsLayout-styles.less'

const { Content, Header, Sider } = Layout

export function ContactsLayout() {
	const [globalSearch, setGlobalSearch] = useState<string>('')
	const debouncedGlobalSearch = useDebounce<string>(globalSearch, 750)

	useLayoutEffect(() => {
		const header = document.querySelector('.contacts-layout__header') as HTMLElement
		const sider = document.querySelector('.contacts-layout__sider') as HTMLElement

		if (header && sider) {
			const headerHeight = header.clientHeight

			// Set the margin-top of the sider to the height of the header + 1rem (margin of the table container).
			// This is done to make the sider (favorites list) aligns to the table container.
			sider.style.marginTop = `calc(${headerHeight}px + 1rem)`
		}
	}, [])

	return (
		<Layout className="contacts-layout">
			<Sider className="contacts-layout__sider" width={250}>
				<FavoritesList />
			</Sider>
			<Content>
				<Layout className="contacts-layout__table-and-global-search">
					<Header className="contacts-layout__header">
						<Space direction="horizontal" className="contacts-global-search" align="center">
							<Info tooltip>
								<Space direction="vertical">
									<h4>Recherche globale</h4>
									<div>
										Ignore les filtres et recherche dans les champs suivants :
										<ul>
											<li>Établissement</li>
											<li>Commune</li>
											<li>Code postal</li>
											<li>Adresse</li>
										</ul>
									</div>
								</Space>
							</Info>
							<Input
								placeholder="Recherche globale"
								allowClear
								prefix={<SearchIcon />}
								onChange={(e) => {
									setGlobalSearch(e.target.value)
								}}
							/>
						</Space>
					</Header>
					<Content className="contacts-table-container">
						<Table globalSearch={debouncedGlobalSearch} />
					</Content>
				</Layout>
			</Content>
		</Layout>
	)
}
