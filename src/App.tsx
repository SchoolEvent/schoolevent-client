import { ConfigProvider, theme as themeAlg } from 'antd'
import frFR from 'antd/lib/locale/fr_FR'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { MainLayout } from '@components'
import { AuthProvider, useTheme } from '@contexts'
import { calendarRoute, contactsRoute, eventsRoute, loginRoute, noMatchRoute } from '@routes'

import './App.less'

function App() {
	const [faviconHref, setFaviconHref] = useState<string>('')
	const { theme } = useTheme()

	useEffect(() => {
		setFaviconHref(`schoolevent_logo_${theme === 'dark' ? 'white' : 'black'}.svg`)
	}, [faviconHref, theme])

	const router = createBrowserRouter([
		loginRoute,
		noMatchRoute,
		{
			path: '/',
			element: (
				<AuthProvider>
					<MainLayout />
				</AuthProvider>
			),
			children: [contactsRoute, calendarRoute, eventsRoute],
		},
	])

	return (
		<ConfigProvider
			theme={{
				cssVar: true,
				token: { colorPrimary: '#FE8E06' },
				algorithm: theme === 'dark' ? themeAlg.darkAlgorithm : themeAlg.defaultAlgorithm,
			}}
			locale={frFR}
		>
			<Helmet>
				<link rel="icon" href={faviconHref} />
			</Helmet>
			<RouterProvider router={router} />
		</ConfigProvider>
	)
}

export default App
