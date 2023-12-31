import { Star as FavoriteIcon } from '@phosphor-icons/react'
import { Table as AntdTable, Button, Space, Typography } from 'antd'
import { ColumnsType, TableRef } from 'antd/lib/table'
import { useEffect, useLayoutEffect, useReducer, useRef } from 'react'

import { useAuth, useFavorites } from '@contexts'
import { ITableStorage } from '@types'
import { useLocalStorage } from '@utils'

import { INIT_TABLE_STATE, SELECTED_FIELDS } from './Table-constants'
import { IAPIResponse, ISchool } from './Table-types'
import { fetchTableData, getSortOrder, reducer } from './Table-utils'

import './Table-styles.less'

export function Table() {
	const [tableConfig, setTableConfig] = useReducer(reducer, INIT_TABLE_STATE)
	const { user } = useAuth()
	const { favorites, addFavorite, deleteFavorite, doesFavoriteExist } = useFavorites()
	const localStorage = useLocalStorage()
	const tableRef = useRef<TableRef>(null)

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
		// This part is used to either set the table config from the local storage
		// or to set the local storage with the table config
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
	}, [tableRef, localStorage])

	useEffect(() => {
		const fetchData = async () => {
			setTableConfig({ type: 'SET_LOADING', payload: { loading: true } })

			const rawResponse = await fetchTableData({
				limit: tableConfig.paginationSize,
				offset: tableConfig.offset,
				select: SELECTED_FIELDS,
				where: 'type_etablissement="Lycée" OR type_etablissement="Collège"',
				orderBy: tableConfig.orderBy,
			})
			const response: IAPIResponse = await rawResponse.json()

			// We add the 'favoris' field to the data
			const data = response.results.map((school) => ({
				...school,
				favoris: favorites.some((fav) => fav.id === school.identifiant_de_l_etablissement),
			}))
			console.log(data)

			setTableConfig({
				type: 'SET_DATA',
				payload: { results: data, total_count: response.total_count },
			})
			setTableConfig({ type: 'SET_LOADING', payload: { loading: false } })
		}

		fetchData()
	}, [tableConfig.paginationSize, tableConfig.offset, tableConfig.orderBy, localStorage, favorites])

	const columns: ColumnsType<ISchool> = [
		{
			key: 'nom_etablissement',
			title: 'Établissement',
			dataIndex: 'nom_etablissement',
			sorter: true,
			sortOrder: getSortOrder('nom_etablissement', tableConfig.orderBy),
		},
		{
			key: 'type_etablissement',
			title: "Type d'établissement",
			dataIndex: 'type_etablissement',
			sorter: true,
			sortOrder: getSortOrder('type_etablissement', tableConfig.orderBy),
		},
		{
			key: 'nom_commune',
			title: 'Commune',
			dataIndex: 'nom_commune',
			sorter: true,
			sortOrder: getSortOrder('nom_commune', tableConfig.orderBy),
		},
		{
			key: 'code_postal',
			title: 'Code postal',
			dataIndex: 'code_postal',
			sorter: true,
			sortOrder: getSortOrder('code_postal', tableConfig.orderBy),
		},
		{
			key: 'adresse_1',
			title: 'Adresse',
			dataIndex: 'adresse_1',
			sorter: true,
			sortOrder: getSortOrder('adresse_1', tableConfig.orderBy),
		},
		{
			key: 'favoris',
			title: 'Favoris',
			dataIndex: 'favoris',
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

	return (
		<AntdTable<ISchool>
			ref={tableRef}
			rowKey={(record) =>
				`${record.identifiant_de_l_etablissement}-${record.nom_commune}-${record.code_postal}`
			}
			scroll={{ y: tableConfig.tableHeight }}
			className="contacts-table"
			columns={columns}
			dataSource={tableConfig.data}
			loading={tableConfig.loading}
			pagination={{
				pageSize: tableConfig.paginationSize,
				pageSizeOptions: [25, 50, 75, 100],
				total: tableConfig.totalCount,
				onShowSizeChange: (_current, size) => {
					setTableConfig({ type: 'SET_PAGINATION_SIZE', payload: { paginationSize: size } })
				},
				onChange: (page, pageSize) => {
					const offset = (page - 1) * pageSize

					setTableConfig({ type: 'SET_OFFSET', payload: { offset } })
				},
				showTotal: (total, range) => {
					return `${range[0]}-${range[1]} sur ${total} établissements`
				},
			}}
			expandable={{
				expandedRowRender: (record) => {
					return (
						<Space direction="horizontal" size="large">
							<span>
								<Typography.Text strong>Email : </Typography.Text>
								{record.mail}
							</span>
							<span>
								<Typography.Text strong>Téléphone : </Typography.Text> {record.telephone}
							</span>
						</Space>
					)
				},
				expandRowByClick: false,
				showExpandColumn: true,
				rowExpandable: (record) => !!record,
			}}
			onChange={(_pagination, _filters, sorter) => {
				if (!Array.isArray(sorter) && Object.entries(sorter).length > 0) {
					const order = sorter.order === 'ascend' ? 'ASC' : 'DESC'

					// The ternary below is used to prevent the column from
					// being stuck in the 'descend' state
					setTableConfig({
						type: 'SET_ORDER_BY',
						payload: sorter.order ? { field: sorter.field as keyof ISchool, order } : null,
					})
				}
			}}
		/>
	)
}
