import { useState } from 'react';
import { Calendar as AntCalendar, Badge, Modal, ConfigProvider, Button ,BadgeProps } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import 'dayjs/locale/fr';
import dayjs, { Dayjs } from 'dayjs';
import frFR from 'antd/lib/locale/fr_FR';

import './Calendar-styles.less';

type Appointment = {
	type: string;
	name: string;
	description: string;
	position: string;
	date: string;
	participant: string;
};

const appointments: Appointment[] = [
	{
		type: 'test',
		name: 'Rencontre Etudiante Esiee-it',
		description: 'Rencontre avec plein d étudiants.',
		position: 'Pontoise',
		date: '2024-01-10',
		participant: 'Nicolas'
	},
	{
		type: 'test',
		name: 'JPO ESCP',
		description: 'Rencontre avec les étudiants pour les lycées.',
		position: 'Paris',
		date: '2024-01-30',
		participant: 'Nicolas'
	},
	{
		type: 'test',
		name: 'Salon SUP de Vente',
		description: 'Salon avec des entrepreneurs et des patrons.',
		position: 'Pontoise',
		date: '2024-01-27',
		participant: 'Nicolas'

	},
];

const Calendar = () => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

	const getListData = (value: Dayjs) => {
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
					<li key={item.name} onClick={() => showAppointmentDetails(item)}>
						<Badge status={item.type as BadgeProps['status']} text={item.name} />
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
		<ConfigProvider locale={frFR}>
			<AntCalendar dateCellRender={dateCellRender} header={(headerProps) => (
					<div>
						<Button type="text" icon={<LeftOutlined />} onClick={() => headerProps.onPrev()} />
						<Button type="text" icon={<RightOutlined />} onClick={() => headerProps.onNext()} />
					</div>
				)}
			/>
			<Modal
				title="Les détails de l'événement :"
				visible={isModalVisible}
				onCancel={handleCancel}
				footer={null}
			>
				{selectedAppointment && (
					<div>
						<p>Type: {selectedAppointment.type}</p>
						<p>Name: {selectedAppointment.name}</p>
						<p>Description: {selectedAppointment.description}</p>
						<p>Position: {selectedAppointment.position}</p>
						<p>Date: {selectedAppointment.date}</p>
						<p>Participant: {selectedAppointment.participant}</p>
					</div>
				)}
			</Modal>

		</ConfigProvider>
	);
};

export { Calendar };
