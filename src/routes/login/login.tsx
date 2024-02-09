import { Helmet } from 'react-helmet'
import { RouteObject } from 'react-router-dom'

import { Login } from '@components'

export const loginRoute: RouteObject = {
	path: '/login',
	element: (
		<>
			<Helmet>
				<title>SchoolEvent | Connexion</title>
			</Helmet>
			<Login />
		</>
	),
}
