import { ITableConfigState, TFiltersRecord } from './Table-types'

export const GOUV_API_URL =
	'https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-annuaire-education/records'

export const SELECTED_FIELDS =
	'identifiant_de_l_etablissement,nom_etablissement,type_etablissement,adresse_1,code_postal,nom_commune,latitude,longitude,mail,telephone'

export const DEFAULT_ETABLISSEMENT_FILTER = "type_etablissement IN ('Collège', 'Lycée')"

export const DEFAULT_FILTER_OBJECT: TFiltersRecord = {
	nom_etablissement: null,
	type_etablissement: null,
	nom_commune: null,
	code_postal: null,
	adresse_1: null,
}

export const INIT_TABLE_STATE: ITableConfigState = {
	data: [],
	loading: true,
	totalCount: undefined,
	paginationSize: 25,
	offset: 0,
	tableHeight: 0,
	where: undefined,
	filters: DEFAULT_FILTER_OBJECT,
	range: null,
	userLocation: undefined,
}
