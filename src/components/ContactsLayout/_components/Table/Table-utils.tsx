import { SortOrder } from 'antd/lib/table/interface'

import { ITableStorage } from '@types'
import { getLocalStorage } from '@utils'

import { GOUV_API_URL } from './Table-constants'
import { IQueryParams, ISchool, ITableConfigState, TReducerActionType } from './Table-types'

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
