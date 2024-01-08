import { useState } from 'react';
import { Layout, Calendar as AntCalendar, Badge, Modal, ConfigProvider } from 'antd';
import type { Dayjs } from 'dayjs';
import 'dayjs/locale/fr';
import frFR from 'antd/lib/locale/fr_FR';
import type { BadgeProps } from 'antd';
// import { calendarClient } from '@supabase/supabase-js'; //
import './Calendar-styles.less';

const { Content, Header } = Layout;

type Appointment = {
	date: string;
	type: string;
	content: string;
	description: string;
};

// info en dur pour test
const appointments: Appointment[] = [
	{ date: '2024-01-10', type: 'warning', content: 'Rencontre Etudiante Esiee-it', description: 'Rencontre avec plein d étudiants.' },
	{ date: '2024-01-30', type: 'success', content: 'JPO ESCP', description: 'Rencontre avec les étudiants pour les lycées.' },
	{ date: '2024-01-27', type: 'success', content: 'Salon SUP de Vente', description: 'Salon avec des entrepreneurs et des patrons.' },
];

const Calendar = () => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
	// const [appointmentsFromAPI, setAppointmentsFromAPI] = useState<Appointment[]>([]);

	/*
	// récup données supabase
	const supabase = calendarClient();

	useEffect(() => {
		const fetchAppointments = async () => {
			let { data: appointments, error } = await supabase
				.from('appointments')
				.select('*');
			if (error) console.log('error', error);
			else setAppointmentsFromAPI(appointments);
		};

		fetchAppointments();
	}, []);
	*/

	const getListData = (value: Dayjs) => {
		// A remplacé 'appointments' par 'appointmentsFromAPI' pour données Supabase
		return appointments.filter(appointment => {
			const [year, month, day] = appointment.date.split('-');
			return value.date() === parseInt(day, 10) && value.month() === parseInt(month, 10) - 1 && value.year() === parseInt(year, 10);
		});
	};

	const dateCellRender = (value: Dayjs) => {
		const listData = getListData(value);
		return (
			<ul className="events">
				{listData.map(item => (
					<li key={item.content} onClick={() => showAppointmentDetails(item)}>
						<Badge status={item.type as BadgeProps['status']} text={item.content} />
					</li>
				))}
			</ul>
		);
	};

	const showAppointmentDetails = (appointment: Appointment) => {
		setSelectedAppointment(appointment);
		setIsModalVisible(true);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	return (
		<Layout className="calendar">
			<Header>Calendrier</Header>
			<ConfigProvider locale={frFR}>
				<Layout>
					<Content>
						<AntCalendar dateCellRender={dateCellRender} />
						<Modal
							title="Détails du Rendez-vous"
							visible={isModalVisible}
							onCancel={handleCancel}
							footer={null}
						>
							{selectedAppointment && (
								<div>
									<p>Type: {selectedAppointment.type}</p>
									<p>Contenu: {selectedAppointment.content}</p>
									<p>Date: {selectedAppointment.date}</p>
									<p>Description: {selectedAppointment.description}</p>
								</div>
							)}
						</Modal>
					</Content>
				</Layout>
			</ConfigProvider>
		</Layout>
	);
};

export { Calendar };
