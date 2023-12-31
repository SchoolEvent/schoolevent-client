import { ConfigProvider } from 'antd'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { MainLayout } from '@components'
import { AuthProvider, useTheme } from '@contexts'
import { contactsRoute, eventsRoute, loginRoute, noMatchRoute } from '@routes'

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
			children: [contactsRoute, eventsRoute],
		},
	])

	return (
		<ConfigProvider
			theme={{
				cssVar: true,
				token: { colorPrimary: '#FE8E06' },
				// TODO: fix issue with dark theme
				// algorithm: theme === 'dark' ? themeAlg.darkAlgorithm : themeAlg.defaultAlgorithm,
			}}
		>
			<Helmet>
				<link rel="icon" href={faviconHref} />
			</Helmet>
			<RouterProvider router={router} />
		</ConfigProvider>
	)
}

export default App
