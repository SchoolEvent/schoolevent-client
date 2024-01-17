import { Table as AntdTable, Grid, Space, Typography } from 'antd'
import { TableRef } from 'antd/lib/table'
import { useRef } from 'react'

import { useMapDisplay, useTheme } from '@contexts'

import { useController } from './Table-controller'
import { ISchool, ITableProps, TFiltersRecord } from './Table-types'
import { QueryStringBuilder, getRowClassname } from './Table-utils'

import './Table-styles.less'

const { useBreakpoint } = Grid

export function Table(props: ITableProps) {
	const { tableConfigReducer } = props
	const { tableConfig, setTableConfig } = tableConfigReducer
	const { setFocusedPin } = useMapDisplay()
	const tableRef = useRef<TableRef>(null)
	const screens = useBreakpoint()
	const { theme } = useTheme()
	const { columns } = useController(props)

	return (
		<AntdTable<ISchool>
			ref={tableRef}
			size={screens.xxl ? 'large' : 'small'}
			rowKey={(record) =>
				`${record.identifiant_de_l_etablissement}-${record.nom_commune}-${record.code_postal}`
			}
			onHeaderRow={() => ({ className: `contacts-table__header__${theme}` })}
			rowClassName={(_record, index) => getRowClassname(index, theme)}
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
				locale: {
					next_page: 'Page suivante',
					prev_page: 'Page précédente',
				},
			}}
			onRow={(record) => ({
				onClick: () => {
					if (record.latitude && record.longitude) {
						setFocusedPin({ lat: record.latitude, lng: record.longitude })
					}
				},
			})}
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
			onChange={(_pagination, filters, sorter) => {
				if (!Array.isArray(sorter) && Object.entries(sorter).length > 0) {
					const order = sorter.order === 'ascend' ? 'ASC' : 'DESC'

					// The ternary below is used to prevent the column from
					// being stuck in the 'descend' state
					setTableConfig({
						type: 'SET_ORDER_BY',
						payload: sorter.order ? { field: sorter.field as keyof ISchool, order } : null,
					})
				}

				setTableConfig({ type: 'SET_FILTERS', payload: { filters: filters as TFiltersRecord } })

				const queryBuilder = new QueryStringBuilder(filters)
				const queryString = queryBuilder.build()

				setTableConfig({ type: 'SET_WHERE', payload: { where: queryString } })
			}}
			locale={{
				emptyText: 'Aucun établissement trouvé',
				filterConfirm: 'OK',
				filterReset: 'Réinitialiser',
				filterTitle: 'Filtres',
				selectAll: 'Tout sélectionner',
				selectInvert: 'Inverser la sélection',
				sortTitle: 'Trier',
				triggerAsc: 'Trier par ordre croissant',
				triggerDesc: 'Trier par ordre décroissant',
				cancelSort: 'Annuler le tri',
			}}
		/>
	)
}
