import { TEventTypeValue } from './EventForm/EventForm-types'

export interface IEventFormFields {
	event_date: Date
	event_name: string
	event_position: string
	event_background?: { file: File; fileList: FileList }
	event_time: string
	event_type: TEventTypeValue
	event_description: string
}
