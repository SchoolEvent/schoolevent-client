import {
	Broom as ClearFiltersIcon,
	XCircle as CloseMapIcon,
	ArrowsOutSimple as ExpandMapIcon,
	MapTrifold as OpenMapIcon,
	ArrowsInSimple as ReduceMapIcon,
	MagnifyingGlass as SearchIcon,
} from '@phosphor-icons/react'
import { Button, Input, Layout, Space } from 'antd'
import { useLayoutEffect, useReducer, useState } from 'react'

import { ContactsMap, IconButton, Info } from '@components'
import { useMapDisplay } from '@contexts'
import { useDebounce } from '@utils'

import { FavoritesList, Table } from './_components'
import { INIT_TABLE_STATE } from './_components/Table/Table-constants'
import { reducer } from './_components/Table/Table-utils'

import './ContactsLayout-styles.less'

const { Content, Header, Sider } = Layout

export function ContactsLayout() {
	const [tableConfig, setTableConfig] = useReducer(reducer, INIT_TABLE_STATE)
	const [globalSearch, setGlobalSearch] = useState<string>('')
	const debouncedGlobalSearch = useDebounce<string>(globalSearch, 750)
	const { displayMap, hideMap, toggleMapState, mapDisplayState } = useMapDisplay()

	const getMapContainerClass = () => {
		if (mapDisplayState.isHidden) {
			return 'map-container__hidden'
		} else if (mapDisplayState.state === 'full') {
			return 'map-container__full'
		} else {
			return 'map-container'
		}
	}

	const getTableContainerClass = () => {
		if (mapDisplayState.isHidden) {
			return 'table-container__full'
		} else if (mapDisplayState.state === 'full') {
			return 'table-container__hidden'
		} else {
			return 'table-container'
		}
	}

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
						<div className={getTableContainerClass()}>
							<Table
								globalSearch={debouncedGlobalSearch}
								tableConfigReducer={{ tableConfig, setTableConfig }}
							/>
							{mapDisplayState.isHidden && (
								<IconButton
									className="map-btn open-map-btn"
									onClick={displayMap}
									type="primary"
									icon={<OpenMapIcon size={20} />}
								/>
							)}
						</div>
						<div className={getMapContainerClass()}>
							<ContactsMap />
							<IconButton
								className="map-btn toggle-mode-btn"
								onClick={toggleMapState}
								type="primary"
								icon={
									mapDisplayState.state === 'full' ? (
										<ReduceMapIcon size={20} />
									) : (
										<ExpandMapIcon size={20} />
									)
								}
							/>
							<IconButton
								className="map-btn close-map-btn"
								onClick={hideMap}
								type="primary"
								icon={<CloseMapIcon size={20} />}
							/>
						</div>
					</Content>
				</Layout>
			</Content>
		</Layout>
	)
}
