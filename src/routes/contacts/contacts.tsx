import { Helmet } from 'react-helmet'
import { RouteObject } from 'react-router-dom'

import { ContactsLayout } from '@components'
import { FavoriteContactsProvider, MapDisplayProvider } from '@contexts'

export const contactsRoute: RouteObject = {
	path: 'contacts',
	element: (
		<>
			<Helmet>
				<title>SchoolEvent | Contacts</title>
			</Helmet>
			<MapDisplayProvider>
				<FavoriteContactsProvider>
					<ContactsLayout />
				</FavoriteContactsProvider>
			</MapDisplayProvider>
		</>
	),
}
