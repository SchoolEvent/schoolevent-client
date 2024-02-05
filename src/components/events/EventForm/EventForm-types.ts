import { Database } from '@types'

type TEvent = Database['public']['Tables']['events']['Row']

export interface IEventFormFields
	extends Omit<TEvent, 'id' | 'event_participant_id' | 'event_creator_id' | 'event_background'> {
	event_background?: { file: File; fileList: FileList }
}

export type TEventTypeLabel = 'Portes ouvertes' | 'Présentation' | 'Conférence'
export type TEventTypeValue = 'portes_ouvertes' | 'presentation' | 'conference'

export const eventTypesRecord: Record<TEventTypeValue, TEventTypeLabel> = {
	portes_ouvertes: 'Portes ouvertes',
	presentation: 'Présentation',
	conference: 'Conférence',
}
