import { Helmet } from 'react-helmet'
import { RouteObject } from 'react-router-dom'

import { Login, ProtectedRoute } from '@components'

export const loginRoute: RouteObject = {
	path: '/login',
	element: (
		<ProtectedRoute>
			<Helmet>
				<title>SchoolEvent | Connexion</title>
			</Helmet>
			<Login />
		</ProtectedRoute>
	),
}
