import { MagnifyingGlass as SearchIcon } from '@phosphor-icons/react'
import { Button, Input, Radio, Space } from 'antd'
import { ColumnType } from 'antd/lib/table'
import { SortOrder } from 'antd/lib/table/interface'

import { ITableStorage } from '@types'
import { getLocalStorage, isStringEmpty } from '@utils'

import {
	DEFAULT_ETABLISSEMENT_FILTER,
	DEFAULT_FILTER_OBJECT,
	GOUV_API_URL,
} from './Table-constants'
import {
	IGetColumnRadioPropsParams,
	IGetColumnSearchPropsParams,
	IQueryParams,
	ISchool,
	ITableConfigState,
	TReducerActionType,
	TTableFilters,
} from './Table-types'

export function fetchTableData(queryParams: IQueryParams) {
	const { limit, offset, select, where, orderBy } = queryParams

	const selectQuery = select ? `&select=${select}` : ''
	const whereQuery = where ? `&where=${where}` : ''
	const orderByQuery = orderBy ? `&order_by=${orderBy}` : ''

	const url = `${GOUV_API_URL}?timezone=Europe%2FParis&limit=${limit}&offset=${offset}${selectQuery}${whereQuery}${orderByQuery}`

	return fetch(url)
}

export function reducer(state: ITableConfigState, action: TReducerActionType): ITableConfigState {
	const localStorage = getLocalStorage()
	const tableStorage = localStorage.get('contacts.table') as ITableStorage

	switch (action.type) {
		case 'SET_DATA':
			return {
				...state,
				data: action.payload.results,
				totalCount: action.payload.total_count,
			}
		case 'SET_LOADING':
			return {
				...state,
				loading: action.payload.loading,
			}
		case 'SET_PAGINATION_SIZE':
			localStorage.set({
				key: 'contacts.table',
				data: {
					...tableStorage,
					paginationSize: action.payload.paginationSize,
				},
			})

			return {
				...state,
				paginationSize: action.payload.paginationSize,
			}
		case 'SET_OFFSET':
			return {
				...state,
				offset: action.payload.offset,
			}
		case 'SET_ORDER_BY':
			if (action.payload === null) {
				localStorage.set({
					key: 'contacts.table',
					data: {
						...tableStorage,
						orderBy: null,
					},
				})

				return {
					...state,
					orderBy: undefined,
				}
			}

			localStorage.set({
				key: 'contacts.table',
				data: {
					...tableStorage,
					orderBy: `${action.payload.field} ${action.payload.order}`,
				},
			})

			return {
				...state,
				orderBy: `${action.payload.field} ${action.payload.order}`,
			}
		case 'SET_TABLE_HEIGHT':
			return {
				...state,
				tableHeight: action.payload.height,
			}
		case 'SET_WHERE':
			return {
				...state,
				where: action.payload.where,
			}
		case 'RESET_FILTERS':
			return {
				...state,
				orderBy: 'nom_etablissement ASC',
				where: DEFAULT_ETABLISSEMENT_FILTER,
				filters: DEFAULT_FILTER_OBJECT,
			}
		case 'SET_FILTERS':
			return {
				...state,
				filters: action.payload.filters,
			}
		case 'SET_RANGE':
			return {
				...state,
				range: action.payload.range,
			}
		case 'SET_USER_LOCATION':
			return {
				...state,
				userLocation: action.payload.location,
			}
	}
}

/**
 * Get the sort order of a column from the orderBy string
 */
export function getSortOrder(
	index: keyof ISchool,
	orderBy: string | undefined,
): SortOrder | undefined {
	if (!orderBy || orderBy === '') {
		return undefined
	}

	const field = orderBy.split(' ')[0]
	const order = orderBy.split(' ')[1]

	if (field === index) {
		return order === 'ASC' ? 'ascend' : 'descend'
	}

	return undefined
}

export function getColumnSearchProps(params: IGetColumnSearchPropsParams): ColumnType<ISchool> {
	const { inputRef } = params

	// Even though selectedKeys is used as an array, it corresponds to the current
	// filter value. It allows to have a controlled input value without declaring
	// a state ourselves.
	return {
		filterDropdown: ({ confirm, clearFilters, selectedKeys, setSelectedKeys }) => (
			<Space className="custom-filter-dropdown search" direction="vertical">
				<Input
					ref={inputRef}
					value={selectedKeys[0]}
					placeholder="Rechercher"
					onChange={(e) => {
						setSelectedKeys(e.target.value ? [e.target.value] : [])
					}}
					onPressEnter={() => confirm()}
				/>
				<Space className="custom-filter-dropdown__btns-container">
					<Button
						type="link"
						size="small"
						onClick={() => {
							clearFilters?.()
							// confirm() is important here because if we don't call it the input
							// won't be cleared properly.
							confirm()
						}}
					>
						Réinitialiser
					</Button>
					<Button
						type="primary"
						size="small"
						onClick={() => {
							confirm()
						}}
					>
						OK
					</Button>
				</Space>
			</Space>
		),
		filterIcon: <SearchIcon size="16px" />,
		onFilterDropdownOpenChange: (visible) => {
			if (visible) {
				// We need to delay the focus ever so slightly to make sure the component
				// is rendered when we focus.
				setTimeout(() => {
					inputRef.current?.focus()
				}, 100)
			}
		},
	}
}

export function getColumnRadioProps(params: IGetColumnRadioPropsParams): ColumnType<ISchool> {
	const { options } = params

	// Even though selectedKeys is used as an array, it corresponds to the current
	// filter value. It allows to have a controlled input value without declaring
	// a state ourselves.
	return {
		filterDropdown: ({ confirm, clearFilters, selectedKeys, setSelectedKeys }) => (
			<Space className="custom-filter-dropdown radio" direction="vertical">
				<Radio.Group value={selectedKeys[0]} onChange={(e) => setSelectedKeys([e.target.value])}>
					<Space direction="vertical">
						{options.map(({ label, value }) => (
							<Radio key={value} value={value}>
								{label}
							</Radio>
						))}
					</Space>
				</Radio.Group>
				<Space className="custom-filter-dropdown__btns-container">
					<Button
						type="link"
						size="small"
						onClick={() => {
							clearFilters?.()
							// confirm() is important here because if we don't call it the input
							// won't be cleared properly.
							confirm()
						}}
					>
						Réinitialiser
					</Button>
					<Button
						type="primary"
						size="small"
						onClick={() => {
							confirm()
						}}
					>
						OK
					</Button>
				</Space>
			</Space>
		),
	}
}

/**
 * This class is a utility class for building SQL WHERE clauses.
 */
export class QueryStringBuilder {
	private filters: TTableFilters | undefined

	constructor(filters?: TTableFilters) {
		this.filters = filters
	}

	/**
	 * Returns the SQL WHERE clause as a string.
	 */
	public build(): string {
		if (!this.filters) {
			return ''
		}

		const where: string[] = []

		for (const [key, value] of Object.entries(this.filters)) {
			if (key === 'type_etablissement') {
				if (value) {
					where.push(`type_etablissement = '${value}'`)
				} else {
					where.push(DEFAULT_ETABLISSEMENT_FILTER)
				}

				continue
			}

			if (value === null) {
				continue
			}

			if (value.length === 0) {
				continue
			}

			if (value.length === 1) {
				where.push(`search(${key}, '${value[0]}')`)
			} else {
				where.push(`${key} IN ('${value.join('","')}')`)
			}
		}

		return where.join(' AND ')
	}

	/**
	 * Returns true if the builder is empty, false otherwise.
	 */
	public isEmpty(): boolean {
		return !this.filters || Object.entries(this.filters).length === 0
	}
}

export function getGlobalSearch(globalSearch: string): string | null {
	if (isStringEmpty(globalSearch)) {
		return null
	}

	return `search(nom_etablissement, '${globalSearch}') OR search(nom_commune, '${globalSearch}') OR search(code_postal, '${globalSearch}') OR search(adresse_1, '${globalSearch}')`
}

export function getRowClassname(index: number, theme: 'light' | 'dark'): string {
	if (index % 2 === 0) {
		return `even-row even-row__${theme}`
	} else {
		return `odd-row odd-row__${theme}`
	}
}
