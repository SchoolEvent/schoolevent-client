import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App as AppProvider, Card, ConfigProvider, Typography, theme as themeAlg } from 'antd'
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
	LoginForm,
	MainLayout,
	ProtectedRoute,
	SignUpForm,
	Success,
} from '@components'
import { AuthProvider, FavoriteContactsProvider, MapDisplayProvider, useTheme } from '@contexts'

import './App.less'

const queryClient = new QueryClient()

function App() {
	const [faviconHref, setFaviconHref] = useState<string>('')
	const { theme } = useTheme()

	useEffect(() => {
		setFaviconHref(`/schoolevent_logo_${theme === 'dark' ? 'white' : 'black'}.svg`)
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
								<Route path="/auth" element={<AuthLayout />}>
									<Route path="*" element={<Navigate to="/auth/login" />} />
									<Route
										path="login"
										element={
											<Card title={<Typography.Title level={2}>Connexion</Typography.Title>}>
												<LoginForm />
											</Card>
										}
									/>
									<Route path="sign-up" element={<Outlet />}>
										<Route path="*" element={<Navigate to="/auth/sign-up" />} />
										<Route
											index
											element={
												<Card title={<Typography.Title level={2}>Inscription</Typography.Title>}>
													<SignUpForm />
												</Card>
											}
										/>
										<Route path="success" element={<Success />} />
									</Route>
								</Route>
							</Routes>
						</AuthProvider>
					</QueryClientProvider>
				</BrowserRouter>
			</ConfigProvider>
		</AppProvider>
	)
}

export default App
