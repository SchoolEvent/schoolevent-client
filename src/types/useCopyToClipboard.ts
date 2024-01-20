export type TCopyFn = (text: string) => Promise<boolean>
export interface ICopyFnReturn {
	copied: boolean
	copy: TCopyFn
}
