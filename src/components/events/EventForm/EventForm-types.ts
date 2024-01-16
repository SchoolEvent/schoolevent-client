export type TEventTypeLabel = 'Portes ouvertes' | 'Présentation' | 'Conférence'
export type TEventTypeValue = 'portes_ouvertes' | 'presentation' | 'conference'

export const eventTypesRecord: Record<TEventTypeValue, TEventTypeLabel> = {
	portes_ouvertes: 'Portes ouvertes',
	presentation: 'Présentation',
	conference: 'Conférence',
}
