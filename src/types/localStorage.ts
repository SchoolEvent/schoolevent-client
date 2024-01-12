export type TStorageKey = 'contacts.table' | 'sidebar.isCollapsed'

export interface ITableStorage {
	orderBy: string | null
	paginationSize: number
}

export interface ISetTableStorage {
	key: 'contacts.table'
	data: ITableStorage
}

export type ISidebarStorage = boolean

export interface ISetSidebarStorage {
	key: 'sidebar.isCollapsed'
	data: ISidebarStorage
}

export type TSetStorageParams = ISetTableStorage | ISetSidebarStorage
export type TGetStorageReturn = ITableStorage | ISidebarStorage | null
