import { Star as FavoriteIcon } from '@phosphor-icons/react'
import { Button, Grid, InputRef } from 'antd'
import { ColumnsType, TableRef } from 'antd/lib/table'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'

import { useAuth, useFavorites, useMapDisplay } from '@contexts'
import { ITableStorage } from '@types'
import { isStringEmpty, useLocalStorage } from '@utils'

import { DEFAULT_ETABLISSEMENT_FILTER, INIT_TABLE_STATE, SELECTED_FIELDS } from './Table-constants'
import { IAPIResponse, ISchool, ITableControllerParams } from './Table-types'
import {
	fetchTableData,
	getColumnRadioProps,
	getColumnSearchProps,
	getGlobalSearch,
	getSortOrder,
} from './Table-utils'

const { useBreakpoint } = Grid

export function useController(params: ITableControllerParams) {
	const { globalSearch, tableConfigReducer } = params
	const { tableConfig, setTableConfig } = tableConfigReducer
	const { user } = useAuth()
	const { mapDisplayState } = useMapDisplay()
	const { favorites, addFavorite, deleteFavorite, doesFavoriteExist } = useFavorites()
	const localStorage = useLocalStorage()
	const tableRef = useRef<TableRef>(null)
	const searchRef = useRef<InputRef>(null)
	const screens = useBreakpoint()

	const handleFavorites = async (record: ISchool) => {
		if (user) {
			const exists = await doesFavoriteExist(record.identifiant_de_l_etablissement, user.id)

			if (exists) {
				await deleteFavorite(record.identifiant_de_l_etablissement, user.id)
			} else {
				await addFavorite(user.id, {
					id: record.identifiant_de_l_etablissement,
					name: record.nom_etablissement,
					city: record.nom_commune,
					postalCode: record.code_postal,
				})
			}
		}
	}

	useLayoutEffect(() => {
		// This part is used to either import the table config from the local storage
		// or to export the table config to the local storage if it doesn't exist.
		if (localStorage.has('contacts.table')) {
			const { orderBy, paginationSize } = localStorage.get('contacts.table') as ITableStorage

			if (orderBy) {
				const field = orderBy?.split(' ')[0] as keyof ISchool
				const order = orderBy?.split(' ')[1] as 'ASC' | 'DESC'

				setTableConfig({ type: 'SET_ORDER_BY', payload: { field, order } })
			} else {
				setTableConfig({
					type: 'SET_ORDER_BY',
					payload: { field: 'nom_etablissement', order: 'ASC' },
				})
			}

			setTableConfig({ type: 'SET_PAGINATION_SIZE', payload: { paginationSize } })
		} else {
			localStorage.set({
				key: 'contacts.table',
				data: { orderBy: null, paginationSize: INIT_TABLE_STATE.paginationSize },
			})
		}

		// Here we set the table body height to fit its container (whole component height)
		// minus the header height (55px)
		const node = tableRef.current
		const clientRect = node?.nativeElement.getBoundingClientRect()

		const top = clientRect?.top ?? 0
		const height = window.innerHeight - top - 55

		setTableConfig({ type: 'SET_TABLE_HEIGHT', payload: { height } })
	}, [tableRef, localStorage, setTableConfig])

	useEffect(() => {
		const fetchData = async () => {
			setTableConfig({ type: 'SET_LOADING', payload: { loading: true } })

			const builtGlobalSearch = getGlobalSearch(globalSearch)
			const defaultWhere = isStringEmpty(tableConfig.where)
				? DEFAULT_ETABLISSEMENT_FILTER
				: tableConfig.where

			// If the global search is set, we use it as the where clause.
			// Otherwise, we use the default where clause.
			const where = builtGlobalSearch
				? `${DEFAULT_ETABLISSEMENT_FILTER} AND (${builtGlobalSearch})`
				: defaultWhere

			const rawResponse = await fetchTableData({
				limit: tableConfig.paginationSize,
				offset: tableConfig.offset,
				select: SELECTED_FIELDS,
				where: tableConfig.range
					? `${where} AND distance(position, geom'POINT(${tableConfig.userLocation?.lng} ${tableConfig.userLocation?.lat})', ${tableConfig.range}km)`
					: where,
				orderBy: tableConfig.orderBy,
			})
			const response: IAPIResponse = await rawResponse.json()

			// We add the 'favoris' field to the data
			const data = response.results.map((school) => ({
				...school,
				favoris: favorites.some((fav) => fav.id === school.identifiant_de_l_etablissement),
			}))

			setTableConfig({
				type: 'SET_DATA',
				payload: { results: data, total_count: response.total_count },
			})
			setTableConfig({ type: 'SET_LOADING', payload: { loading: false } })
		}

		fetchData()
	}, [
		tableConfig.paginationSize,
		tableConfig.offset,
		tableConfig.orderBy,
		tableConfig.where,
		tableConfig.range,
		tableConfig.userLocation,
		localStorage,
		favorites,
		globalSearch,
		setTableConfig,
	])

	const stringifiedFilters = JSON.stringify(tableConfig.filters)
	const stringifiedOrderBy = JSON.stringify(tableConfig.orderBy)

	const columns: ColumnsType<ISchool> = useMemo(
		() => {
			if (mapDisplayState.isHidden) {
				return [
					{
						key: 'nom_etablissement',
						title: 'Établissement',
						dataIndex: 'nom_etablissement',
						sorter: true,
						sortOrder: getSortOrder('nom_etablissement', tableConfig.orderBy),
						...getColumnSearchProps({
							inputRef: searchRef,
						}),
						filteredValue: tableConfig.filters.nom_etablissement,
						filterMultiple: true,
					},
					{
						key: 'type_etablissement',
						title: "Type d'établissement",
						dataIndex: 'type_etablissement',
						sorter: true,
						sortOrder: getSortOrder('type_etablissement', tableConfig.orderBy),
						...getColumnRadioProps({
							options: [
								{ label: 'Collège', value: 'Collège' },
								{ label: 'Lycée', value: 'Lycée' },
							],
						}),
						filteredValue: tableConfig.filters.type_etablissement,
						filterMultiple: true,
					},
					{
						key: 'nom_commune',
						title: 'Commune',
						dataIndex: 'nom_commune',
						sorter: true,
						sortOrder: getSortOrder('nom_commune', tableConfig.orderBy),
						...getColumnSearchProps({
							inputRef: searchRef,
						}),
						filteredValue: tableConfig.filters.nom_commune,
						filterMultiple: true,
					},
					{
						key: 'code_postal',
						title: 'Code postal',
						dataIndex: 'code_postal',
						width: screens.xxl ? 175 : 150,
						sorter: true,
						sortOrder: getSortOrder('code_postal', tableConfig.orderBy),
						...getColumnSearchProps({
							inputRef: searchRef,
						}),
						filteredValue: tableConfig.filters.code_postal,
						filterMultiple: true,
					},
					{
						key: 'adresse_1',
						title: 'Adresse',
						dataIndex: 'adresse_1',
						sorter: true,
						sortOrder: getSortOrder('adresse_1', tableConfig.orderBy),
						...getColumnSearchProps({
							inputRef: searchRef,
						}),
						filteredValue: tableConfig.filters.adresse_1,
						filterMultiple: true,
					},
					{
						key: 'favoris',
						title: 'Favoris',
						dataIndex: 'favoris',
						width: screens.xxl ? 100 : 75,
						render: (value, record) => {
							return (
								<Button
									className="favorite-button"
									onClick={async () => {
										await handleFavorites(record)
									}}
									icon={<FavoriteIcon size="1rem" weight={value ? 'fill' : 'regular'} />}
									type="text"
								/>
							)
						},
					},
				]
			} else {
				return [
					{
						key: 'nom_etablissement',
						title: 'Établissement',
						dataIndex: 'nom_etablissement',
						sorter: true,
						sortOrder: getSortOrder('nom_etablissement', tableConfig.orderBy),
						...getColumnSearchProps({
							inputRef: searchRef,
						}),
						filteredValue: tableConfig.filters.nom_etablissement,
						filterMultiple: true,
					},
					{
						key: 'nom_commune',
						title: 'Commune',
						dataIndex: 'nom_commune',
						sorter: true,
						sortOrder: getSortOrder('nom_commune', tableConfig.orderBy),
						...getColumnSearchProps({
							inputRef: searchRef,
						}),
						filteredValue: tableConfig.filters.nom_commune,
						filterMultiple: true,
					},
					{
						key: 'adresse_1',
						title: 'Adresse',
						dataIndex: 'adresse_1',
						sorter: true,
						sortOrder: getSortOrder('adresse_1', tableConfig.orderBy),
						...getColumnSearchProps({
							inputRef: searchRef,
						}),
						filteredValue: tableConfig.filters.adresse_1,
						filterMultiple: true,
					},
					{
						key: 'favoris',
						title: 'Favoris',
						dataIndex: 'favoris',
						width: screens.xxl ? 100 : 75,
						render: (value, record) => {
							return (
								<Button
									className="favorite-button"
									onClick={async () => {
										await handleFavorites(record)
									}}
									icon={<FavoriteIcon size="1rem" weight={value ? 'fill' : 'regular'} />}
									type="text"
								/>
							)
						},
					},
				]
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[stringifiedFilters, stringifiedOrderBy, screens.xxl, mapDisplayState.isHidden],
	)

	return {
		columns,
	}
}
