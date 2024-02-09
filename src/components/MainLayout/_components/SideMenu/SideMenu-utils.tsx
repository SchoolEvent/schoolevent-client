import {
	Briefcase as AppointmentsIcon,
	CalendarBlank as CalendarIcon,
	UsersThree as ContactsIcon,
	Ticket as EventsIcon,
	House as HomeIcon,
	ChartLineUp as StatsIcon,
	Student as StudentsIcon,
} from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

import { Database } from '@types'

export function getActiveLink(pathname: string) {
	const path = pathname.split('/').filter((i) => i)

	if (path.length === 0) return 'menu-home'

	return `menu-${path[0]}`
}

/**
 * Returns the items for the side menu based on user role.
 */
export function getItems(role: Database['public']['Enums']['user_role'] | null) {
	switch (role) {
		case 'student':
			return [
				{
					key: 'menu-home',
					icon: <HomeIcon size="1rem" />,
					label: <Link to="/">Accueil</Link>,
				},
				{
					key: 'menu-events',
					icon: <EventsIcon size="1rem" />,
					label: <Link to="/events">Événements</Link>,
				},
			]
		case 'admin':
		case 'manager':
			return [
				{
					key: 'menu-home',
					icon: <HomeIcon size="1rem" />,
					label: <Link to="/">Accueil</Link>,
				},
				{
					key: 'menu-contacts',
					icon: <ContactsIcon size="1rem" />,
					label: <Link to="/contacts">Contacts</Link>,
				},
				{
					key: 'menu-calendar',
					icon: <CalendarIcon size="1rem" />,
					label: <Link to="/calendar">Calendrier</Link>,
				},
				{
					key: 'menu-appointments',
					icon: <AppointmentsIcon size="1rem" />,
					label: <Link to="/appointments">Rendez-vous</Link>,
				},
				{
					key: 'menu-events',
					icon: <EventsIcon size="1rem" />,
					label: <Link to="/events">Événements</Link>,
				},
				{
					key: 'menu-students',
					icon: <StudentsIcon size="1rem" />,
					label: <Link to="/students">Étudiants</Link>,
				},
				{
					key: 'menu-stats',
					icon: <StatsIcon size="1rem" />,
					label: <Link to="/stats">Statistiques</Link>,
				},
			]
		default:
			return []
	}
}
