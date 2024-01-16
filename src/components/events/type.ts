import { TEventTypeValue } from './EventForm/EventForm-types'

export interface IEventFormFields {
	id: string
	event_date: Date
	event_title: string
	event_adress: string
	event_background?: { file: File; fileList: FileList }
	event_duration: string
	event_type: TEventTypeValue
	event_description: string
	event_creator_id: string
	event_school_name: string
}
