export function getFilePathFromUrl(url: string) {
	return url.split('/').at(-1) as string
}
