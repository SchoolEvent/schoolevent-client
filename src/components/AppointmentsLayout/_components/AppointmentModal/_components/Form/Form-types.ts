import { TAppointment } from '@types'

export interface IFormValues extends Omit<TAppointment, 'id'> {}

export type TFormProps = IFormEditOrNewModeProps | IFormViewModeProps

interface IFormEditOrNewModeProps {
	initialValues?: Partial<IFormValues>
	isLoading: boolean
	isPending?: boolean
	onFinish: (values: IFormValues) => void
	mode: 'edit' | 'new'
}

interface IFormViewModeProps {
	initialValues: Partial<IFormValues> | undefined
	isLoading: boolean
	isPending?: never
	onFinish?: never
	mode: 'view'
}

export const submitButtonLabel = {
	edit: 'Enregistrer',
	new: 'Créer le rendez-vous',
	view: null,
} as const
