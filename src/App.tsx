import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App as AppProvider, ConfigProvider, theme as themeAlg } from 'antd'
import frFR from 'antd/lib/locale/fr_FR'
import { useEffect, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Helmet } from 'react-helmet'
import { BrowserRouter, Link, Navigate, Outlet, Route, Routes } from 'react-router-dom'

import {
	AppointmentsLayout,
	AuthLayout,
	CalendarLayout,
	ContactsLayout,
	EventForm,
	MainLayout,
	ProtectedRoute,
} from '@components'
import { AuthProvider, FavoriteContactsProvider, MapDisplayProvider, useTheme } from '@contexts'

import './App.less'

const queryClient = new QueryClient()

function App() {
	const [faviconHref, setFaviconHref] = useState<string>('')
	const { theme } = useTheme()

	useEffect(() => {
		setFaviconHref(`schoolevent_logo_${theme === 'dark' ? 'white' : 'black'}.svg`)
	}, [faviconHref, theme])

	return (
		<AppProvider notification={{ placement: 'bottomRight', maxCount: 3, stack: { threshold: 2 } }}>
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
				<BrowserRouter>
					<QueryClientProvider client={queryClient}>
						<AuthProvider>
							<Routes>
								<Route path="*" element={<Navigate to="/" />} />
								<Route
									path="/"
									element={
										<FavoriteContactsProvider>
											<MainLayout />
										</FavoriteContactsProvider>
									}
								>
									<Route
										path="contacts"
										element={
											<ProtectedRoute>
												<Helmet>
													<title>SchoolEvent | Contacts</title>
												</Helmet>
												<MapDisplayProvider>
													<ContactsLayout />
												</MapDisplayProvider>
											</ProtectedRoute>
										}
									/>
									<Route
										path="calendar"
										element={
											<ProtectedRoute>
												<Helmet>
													<title>SchoolEvent | Calendier</title>
												</Helmet>
												<CalendarLayout />
											</ProtectedRoute>
										}
									/>
									<Route
										path="events"
										element={
											<ProtectedRoute>
												<Outlet />
											</ProtectedRoute>
										}
									>
										<Route index element={<Link to="/events/new">new event</Link>} />
										<Route path="new" element={<EventForm />} />
									</Route>
									<Route
										path="appointments"
										element={
											<ProtectedRoute>
												<Helmet>
													<title>SchoolEvent | Rendez-vous</title>
												</Helmet>
												<DndProvider backend={HTML5Backend}>
													<AppointmentsLayout />
												</DndProvider>
											</ProtectedRoute>
										}
									/>
								</Route>
								<Route path="/login" element={<AuthLayout />} />
							</Routes>
						</AuthProvider>
					</QueryClientProvider>
				</BrowserRouter>
			</ConfigProvider>
		</AppProvider>
	)
}

export default App
