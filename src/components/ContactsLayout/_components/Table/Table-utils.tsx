import { MagnifyingGlass as SearchIcon } from '@phosphor-icons/react'
import { Button, Input, Space } from 'antd'
import { ColumnType } from 'antd/lib/table'
import { SortOrder } from 'antd/lib/table/interface'

import { ITableStorage } from '@types'
import { getLocalStorage } from '@utils'

import { GOUV_API_URL } from './Table-constants'
import {
	IGetColumnSearchPropsParams,
	IQueryParams,
	ISchool,
	ITableConfigState,
	TReducerActionType,
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
	const { inputRef, confirmCallback, resetCallback } = params

	// Even though selectedKeys is used as an array, it corresponds to the current
	// filter value. It allows to have a controlled input value without declaring
	// a state ourselves.
	return {
		filterDropdown: ({ confirm, clearFilters, selectedKeys, setSelectedKeys }) => (
			<div className="custom-filter-dropdown">
				<Input
					ref={inputRef}
					value={selectedKeys[0]}
					placeholder="Rechercher"
					onChange={(e) => {
						setSelectedKeys(e.target.value ? [e.target.value] : [])
					}}
				/>
				<Space className="custom-filter-dropdown__btns-container">
					<Button
						type="link"
						size="small"
						onClick={() => {
							console.log(selectedKeys)
							resetCallback?.()
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
							confirmCallback?.(selectedKeys[0] as string)
							confirm()
						}}
					>
						OK
					</Button>
				</Space>
			</div>
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

/**
 * This class is a utility class for building SQL WHERE clauses.
 *
 * Each conditions **MUST** be chained with the method `.and()` or `.or()`.
 *
 * @example
 * ```
 * const builder = new WhereQueryBuilder()
 * builder.equals('type_etablissement', 'Collège').and().equals('code_postal', '95310')
 * const queryString = builder.build()
 * // queryString = "type_etablissement="Collège" AND code_postal="95310""
 * ```
 */
export class WhereQueryBuilder {
	private conditions: (string | WhereQueryBuilder)[] = []

	constructor(conditions?: (string | WhereQueryBuilder)[]) {
		if (conditions) {
			this.conditions = conditions
		}
	}

	/**
	 * Adds an equality condition to the query. Returns the current instance for
	 * chaining.
	 */
	equals(field: string, value: React.Key): WhereQueryBuilder {
		this.conditions.push(`${field}=${this.stringifyValue(value)}`)
		return this
	}

	/**
	 * Adds a greater-than condition to the query. Returns the current instance
	 * for chaining.
	 */
	greaterThan(field: string, value: number): WhereQueryBuilder {
		this.conditions.push(`${field}>${value}`)
		return this
	}

	/**
	 * Adds a lower-than condition to the query. Returns the current instance
	 * for chaining.
	 */
	lowerThan(field: string, value: number): WhereQueryBuilder {
		this.conditions.push(`${field}<${value}`)
		return this
	}

	/**
	 * Adds a LIKE condition to the query. Returns the current instance for chaining.
	 */
	like(field: string, value: React.Key): WhereQueryBuilder {
		this.conditions.push(`${field} LIKE ${this.stringifyValue(value)}`)
		return this
	}

	/**
	 * Adds a custom condition to the query. Returns the current instance for chaining.
	 */
	custom(condition: string): WhereQueryBuilder {
		this.conditions.push(condition)
		return this
	}

	/**
	 * Adds an AND operator to the query. Returns the current instance for chaining.
	 */
	and(): WhereQueryBuilder {
		this.conditions.push('AND')
		return this
	}

	/**
	 * Adds an OR operator to the query. Returns the current instance for chaining.
	 */
	or(): WhereQueryBuilder {
		this.conditions.push('OR')
		return this
	}

	/**
	 * Opens a parenthesis for nested conditions. This method helps build complex
	 * queries. Returns a new instance for the nested conditions.
	 */
	openParen(): WhereQueryBuilder {
		const subBuilder = new WhereQueryBuilder()
		this.conditions.push(subBuilder)
		return subBuilder
	}

	/**
	 * Closes a parenthesis for nested conditions. Returns the parent instance for
	 * chaining.
	 */
	closeParen(): WhereQueryBuilder {
		return this
	}

	/**
	 * Builds and returns the final query string.
	 */
	build(): string {
		const result = this.conditions
			.map((condition) => {
				if (condition instanceof WhereQueryBuilder) {
					return `(${condition.build()})`
				}

				return condition
			})
			.join(' ')

		return result
	}

	hasDefaultSchoolFilter(): boolean {
		return this.build().includes('type_etablissement="Collège" OR type_etablissement="Lycée"')
	}

	indexOf(condition: string | WhereQueryBuilder): number {
		return this.conditions.indexOf(condition)
	}

	removeDefaultSchoolFilter(): void {
		const indexOfCollege = this.indexOf('type_etablissement="Collège"')
		const indexOfLycee = this.indexOf('type_etablissement="Lycée"')

		if (indexOfCollege !== -1 && indexOfLycee !== -1) {
			if (indexOfCollege < indexOfLycee) {
				this.conditions.splice(indexOfCollege, indexOfLycee - indexOfCollege + 1)
			} else {
				this.conditions.splice(indexOfLycee, indexOfCollege - indexOfLycee + 1)
			}
		}
	}

	removeCondition(condition: string | WhereQueryBuilder): WhereQueryBuilder {
		const index = this.conditions.indexOf(condition)
		if (index !== -1) {
			this.conditions.splice(index, 1)
		}
		return this
	}

	isEmpty(): boolean {
		return this.conditions.length === 0
	}

	search(field: string, value: string): WhereQueryBuilder {
		this.conditions.push(`search(${field}, "${value}")`)
		return this
	}

	copy(): WhereQueryBuilder {
		return new WhereQueryBuilder(this.conditions)
	}

	/**
	 * Private method to convert a value to a string. If the value is a string,
	 * it is enclosed in quotes.
	 */
	private stringifyValue(value: React.Key): string {
		if (typeof value === 'string') {
			return `"${value}"`
		}
		return String(value)
	}
}
