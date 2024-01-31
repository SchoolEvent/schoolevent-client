import { TAppointment } from '@types'

export interface IFormValues extends Omit<TAppointment, 'id'> {}
