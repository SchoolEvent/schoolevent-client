export const BASE_URL = 'http://localhost:5173'
export const LOGIN_URL = `${BASE_URL}/login`
export const CONTACTS_URL = `${BASE_URL}/contacts`
export const CALENDAR_URL = `${BASE_URL}/calendar`
export const APPOINTMENTS_URL = `${BASE_URL}/appointments`
export const EVENTS_URL = `${BASE_URL}/events`
export const STUDENTS_URL = `${BASE_URL}/students`
export const STATS_URL = `${BASE_URL}/statistics`

export const MANAGER_USER = {
	email: 'manager@esiee-it.fr',
	password: 'manager',
}
export const STUDENT_USER = {
	email: 'student@edu.esiee-it.fr',
	password: 'student',
}
export const SIDE_MENU_LABELS = {
	admin: {
		shouldHaveAccessTo: [
			'Accueil',
			'Contacts',
			'Calendrier',
			'Rendez-vous',
			'Événements',
			'Étudiants',
			'Statistiques',
		],
	},
	manager: {
		shouldHaveAccessTo: [
			'Accueil',
			'Contacts',
			'Calendrier',
			'Rendez-vous',
			'Événements',
			'Étudiants',
			'Statistiques',
		],
	},
	student: {
		shouldHaveAccessTo: ['Accueil', 'Événements'],
		shouldNotHaveAccessTo: ['Contacts', 'Calendrier', 'Rendez-vous', 'Étudiants', 'Statistiques'],
	},
}
