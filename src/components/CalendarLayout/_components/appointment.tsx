import dayjs, { Dayjs } from 'dayjs'

export interface Appointment {
	name: string
	type: string
	description: string
	position: string
	date: Dayjs
	participant: string
}

export const appointments: Appointment[] = [
	{
		type: 'warning',
		name: 'Rencontre Etudiante Esiee-it',
		description: 'Rencontre avec plein d étudiants.',
		position: 'Pontoise',
		date: dayjs('2024-01-10'),
		participant: 'Nicolas',
	},
	{
		type: 'warning',
		name: 'Rencontre Etudiante ESCP',
		description: 'Rencontre avec plein d étudiants.',
		position: 'Paris',
		date: dayjs('2024-01-10'),
		participant: 'Mathieu',
	},
	{
		type: 'warning',
		name: 'JPO ESCP',
		description: 'Rencontre avec les étudiants pour les lycées.',
		position: 'Paris',
		date: dayjs('2024-01-30'),
		participant: 'Nicolas',
	},
	{
		type: 'warning',
		name: 'Salon SUP de Vente',
		description: 'Salon avec des entrepreneurs et des patrons.',
		position: 'Pontoise',
		date: dayjs('2024-01-27'),
		participant: 'Nicolas',
	},
]
