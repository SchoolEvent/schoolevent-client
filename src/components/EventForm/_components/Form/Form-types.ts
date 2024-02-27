import { Database } from '@types'

export interface IFormProps {
	initialValues?: string
}

export const eventTypeLabelRecord: Record<Database['public']['Enums']['event_type'], string> = {
	open_day: 'Portes ouvertes',
	presentation: 'Présentation',
	conference: 'Conférence',
}
