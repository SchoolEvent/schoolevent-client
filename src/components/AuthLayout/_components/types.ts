export interface ILoginFormFields {
	email?: string
	password?: string
}

export interface ISignUpFormFields extends ILoginFormFields {
	confirmPassword?: string
}
