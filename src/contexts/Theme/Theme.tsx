import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { PropsWithChildren } from '@types'

import { IThemeContext } from './Theme-types'

const ThemeContext = createContext<IThemeContext>({} as IThemeContext)

export function ThemeProvider({ children }: PropsWithChildren) {
	const [theme, setTheme] = useState<'light' | 'dark'>('light')

	const toggleTheme = () => {
		setTheme((prevState) => (prevState === 'light' ? 'dark' : 'light'))
	}

	const value: IThemeContext = useMemo(
		() => ({
			theme,
			toggleTheme,
		}),
		[theme],
	)

	useEffect(() => {
		const matcher = window.matchMedia('(prefers-color-scheme: dark)')

		setTheme(matcher.matches ? 'dark' : 'light')

		matcher.onchange = () => setTheme(matcher.matches ? 'dark' : 'light')
	}, [])

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
	return useContext(ThemeContext)
}
