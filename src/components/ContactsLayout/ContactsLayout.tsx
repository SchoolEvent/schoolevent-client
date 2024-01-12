import { Broom as ClearFiltersIcon, MagnifyingGlass as SearchIcon } from '@phosphor-icons/react'
import { ArrowsOutSimple, MapTrifold, XCircle } from '@phosphor-icons/react'
import { Button, ConfigProvider, FloatButton, Input, Layout, Space } from 'antd'
import { useLayoutEffect, useReducer, useState } from 'react'

import { Info } from '@components'
import { useDebounce } from '@utils'

import Map from '../Map/Map'
import { FavoritesList, Table } from './_components'
import { INIT_TABLE_STATE } from './_components/Table/Table-constants'
import { reducer } from './_components/Table/Table-utils'

import './ContactsLayout-styles.less'

const { Content, Header, Sider } = Layout

export function ContactsLayout() {
	const [tableConfig, setTableConfig] = useReducer(reducer, INIT_TABLE_STATE)
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

	const resetTableFilters = () => {
		setTableConfig({ type: 'RESET_FILTERS' })
	}

	const [fullMap, setFullMap] = useState(false)
	const [hideMap, setHideMap] = useState(true)
	const [showButton, setShowButton] = useState(true)

	function showMapContainer() {
		setHideMap((hideMap) => !hideMap)
		setShowButton(!showButton)
	}

	function fullMapDisplay() {
		setFullMap((fullMap) => !fullMap)
	}

	return (
		<Layout className="contacts-layout">
			<Sider className="contacts-layout__sider" width={250}>
				<FavoritesList />
			</Sider>
			<Content>
				<Layout className="contacts-layout__table-and-global-search">
					<Header className="contacts-layout__header">
						<Space direction="horizontal" className="contacts-table__header" size="large">
							<Space direction="horizontal" className="contacts-global-search">
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
							<Button
								className="clear-filters-btn"
								type="primary"
								icon={<ClearFiltersIcon size="16px" />}
								onClick={() => {
									resetTableFilters()
								}}
							>
								Réinitialiser les filtres
							</Button>
						</Space>
					</Header>
					<Content className="contacts-table-container">
						<div
							className={
								hideMap
									? 'full-table-container'
									: fullMap
									? 'hide-table-container'
									: 'table-container'
							}
						>
							<Table
								globalSearch={debouncedGlobalSearch}
								tableConfigReducer={{ tableConfig, setTableConfig }}
							/>
							<ConfigProvider theme={{ components: { FloatButton: { borderRadiusLG: 12 } } }}>
								{showButton && (
									<FloatButton
										onClick={showMapContainer}
										shape="square"
										type="primary"
										icon={<MapTrifold size={25} weight="thin" style={{ paddingRight: '5px' }} />}
										style={{ right: 40, bottom: 20 }}
									></FloatButton>
								)}
							</ConfigProvider>
						</div>
						<div
							className={
								hideMap ? 'hide-map-container' : fullMap ? 'full-map-container' : 'map-container'
							}
						>
							<Map />
							<ConfigProvider theme={{ components: { FloatButton: { borderRadiusLG: 12 } } }}>
								<FloatButton
									onClick={fullMapDisplay}
									shape="square"
									type="primary"
									icon={<ArrowsOutSimple size={25} weight="thin" style={{ paddingRight: '3px' }} />}
									style={{ right: 50, bottom: 100 }}
								></FloatButton>
								<FloatButton
									onClick={showMapContainer}
									shape="square"
									type="primary"
									icon={<XCircle size={25} weight="thin" />}
									style={{ right: 50 }}
								></FloatButton>
							</ConfigProvider>
						</div>
					</Content>
				</Layout>
			</Content>
		</Layout>
	)
}
