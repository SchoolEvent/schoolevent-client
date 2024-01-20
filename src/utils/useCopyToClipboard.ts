import { useState } from 'react'

import { ICopyFnReturn, TCopyFn } from '@types'

export function useCopyToClipboard(timeout = 2000): ICopyFnReturn {
	const [copied, setCopied] = useState<boolean>(false)

	const copy: TCopyFn = async (text) => {
		if (!navigator?.clipboard) {
			console.warn('Clipboard not supported')
			return false
		}

		try {
			await navigator.clipboard.writeText(text)

			setCopied(true)

			// Reset the state after the timeout
			setTimeout(() => {
				setCopied(false)
			}, timeout)

			return true
		} catch (error) {
			console.warn('Copy failed', error)

			setCopied(false)

			return false
		}
	}

	return { copied, copy }
}
