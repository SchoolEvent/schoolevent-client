import { InputRef } from 'antd'

import { WhereQueryBuilder } from './Table-utils'

export interface IQueryParams {
	limit: number
	offset: number
	select?: string
	where?: string
	orderBy?: string
}

export interface ISchool {
	identifiant_de_l_etablissement: string
	nom_etablissement: string
	type_etablissement: string
	adresse_1: string
	code_postal: string
	nom_commune: string
	latitude: string
	longitude: string
	mail: string
	telephone: string
	favoris: boolean
}

export type TReducerActionType =
	| TSetDataAction
	| TSetLoadingAction
	| TSetPaginationSizeAction
	| TSetOffsetAction
	| TSetOrderByAction
	| TSetTableHeightAction
	| TSetWhereAction

export interface IAPIResponse {
	total_count: number
	results: Omit<ISchool, 'favoris'>[]
}

type TSetDataAction = {
	type: 'SET_DATA'
	payload: {
		total_count: number
		results: ISchool[]
	}
}

type TSetLoadingAction = {
	type: 'SET_LOADING'
	payload: {
		loading: boolean
	}
}

type TSetPaginationSizeAction = {
	type: 'SET_PAGINATION_SIZE'
	payload: {
		paginationSize: number
	}
}

type TSetOffsetAction = {
	type: 'SET_OFFSET'
	payload: {
		offset: number
	}
}

type TSetOrderByAction = {
	type: 'SET_ORDER_BY'
	payload: {
		field: keyof ISchool
		order: 'ASC' | 'DESC'
	} | null
}

type TSetTableHeightAction = {
	type: 'SET_TABLE_HEIGHT'
	payload: {
		height: number
	}
}

type TSetWhereAction = {
	type: 'SET_WHERE'
	payload: {
		where: WhereQueryBuilder
	}
}

export interface ITableConfigState {
	data: ISchool[]
	loading: boolean
	totalCount: number | undefined
	paginationSize: number
	offset: number
	orderBy?: string
	tableHeight: number
	where: WhereQueryBuilder
}

export interface IGetColumnSearchPropsParams {
	dataIndex: keyof Omit<ISchool, 'favoris'>
	inputRef: React.RefObject<InputRef>
	confirmCallback?: (q: string | undefined) => void
	resetCallback?: () => void
}
