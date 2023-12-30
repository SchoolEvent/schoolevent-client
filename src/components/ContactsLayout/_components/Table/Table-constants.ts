import { ITableConfigState } from './Table-types'
import { WhereQueryBuilder } from './Table-utils'

export const GOUV_API_URL =
	'https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-annuaire-education/records'

export const SELECTED_FIELDS =
	'identifiant_de_l_etablissement,nom_etablissement,type_etablissement,adresse_1,code_postal,nom_commune,latitude,longitude,mail,telephone'

export const INIT_TABLE_STATE: ITableConfigState = {
	data: [],
	loading: true,
	totalCount: undefined,
	paginationSize: 25,
	offset: 0,
	tableHeight: 0,
	where: new WhereQueryBuilder(),
}
