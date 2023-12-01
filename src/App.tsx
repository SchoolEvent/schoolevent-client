import { ConfigProvider, theme as themeAlg } from 'antd'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { ContactsLayout, MainLayout } from '@components'
import { AuthProvider, useTheme } from '@contexts'
import { loginRoute, noMatchRoute } from '@routes'

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
			children: [
				{
					path: 'contacts',
					element: <ContactsLayout />,
				},
			],
		},
	])

	return (
		<ConfigProvider
			theme={{
				token: { colorPrimary: '#FE8E06' },
				algorithm: theme === 'dark' ? themeAlg.darkAlgorithm : themeAlg.defaultAlgorithm,
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
