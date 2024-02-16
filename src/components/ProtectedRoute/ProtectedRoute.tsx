import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '@contexts'
import { PropsWithChildren } from '@types'
import { getAllowedRoutes } from '@utils'

export function ProtectedRoute({ children }: PropsWithChildren): React.ReactElement {
	const { role } = useAuth()
	const location = useLocation()

	if (!role) return <></>

	const pathname = location.pathname.split('/').filter((i) => i)
	const allowedRoutes = getAllowedRoutes(role)

	if (!allowedRoutes.includes(pathname[0])) {
		return <Navigate to="/" />
	}

	return <>{children}</>
}
