import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Badge, Button, ConfigProvider, Modal, Select } from 'antd'
import { Calendar as AntCalendar } from 'antd'
import { BadgeProps } from 'antd/lib/badge'
import frFR from 'antd/lib/locale/fr_FR'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/fr'
import { useCallback, useMemo, useState } from 'react'

import { Appointment, appointments } from '../appointment.tsx'

const Calendar = () => {
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
	const [currentDate, setCurrentDate] = useState(dayjs())

	const currentYear = dayjs().year()
	const years = useMemo(() => Array.from({ length: 6 }, (_, i) => currentYear + i), [currentYear])

	const getListData = (value: Dayjs) => {
		return appointments.filter((appointment) => {
			const appointmentDate = dayjs(appointment.date)
			return appointmentDate.isSame(value, 'day')
		})
	}

	const showAppointmentDetails = (appointment: Appointment) => {
		setSelectedAppointment(appointment)
		setIsModalVisible(true)
	}

	const dateCellRender = (value: Dayjs) => {
		const listData = getListData(value)
		return (
			<ul className="events">
				{listData.map((item) => (
					<li key={item.name} onClick={() => showAppointmentDetails(item)}>
						<Badge status={item.type as BadgeProps['status']} text={item.name} />
					</li>
				))}
			</ul>
		)
	}

	const handlePrevMonth = () => {
		setCurrentDate(currentDate.subtract(1, 'month'))
	}

	const handleNextMonth = () => {
		setCurrentDate(currentDate.add(1, 'month'))
	}

	const handleYearSelectChange = useCallback(
		(newYear: string) => {
			const updatedValue = currentDate.clone().year(Number(newYear))
			setCurrentDate(updatedValue)
		},
		[currentDate, setCurrentDate],
	)

	const handleMonthSelectChange = useCallback(
		(newMonth: string) => {
			const updatedValue = currentDate.clone().month(Number(newMonth))
			setCurrentDate(updatedValue)
		},
		[currentDate, setCurrentDate],
	)

	interface HeaderRenderParams {
		value: Dayjs
		type: string
		onChange: (value: Dayjs) => void
	}

	const headerRender = useCallback(
		({ value }: HeaderRenderParams) => {
			const start = 0
			const end = 12
			const monthOptions = []

			const current = value.clone()
			const months = []
			for (let i = 0; i < 12; i++) {
				months.push(current.locale('fr').month(i).format('MMM'))
			}

			for (let index = start; index < end; index++) {
				monthOptions.push(
					<Select.Option className="month-item" key={`${index}`}>
						{months[index]}
					</Select.Option>,
				)
			}

			return (
				<div style={{ padding: 20, display: 'flex', alignItems: 'center' }}>
					<Button size="small" onClick={handlePrevMonth}>
						<LeftOutlined />
					</Button>
					<Select
						size="small"
						dropdownMatchSelectWidth={false}
						className="my-year-select"
						onChange={handleYearSelectChange}
						value={String(currentDate.year())}
					>
						{years.map((year) => (
							<Select.Option key={year} value={String(year)}>
								{year}
							</Select.Option>
						))}
					</Select>
					<Select
						size="small"
						dropdownMatchSelectWidth={false}
						className="my-month-select"
						onChange={handleMonthSelectChange}
						value={String(currentDate.month())}
					>
						{monthOptions}
					</Select>
					<Button size="small" onClick={handleNextMonth}>
						<RightOutlined />
					</Button>
				</div>
			)
		},
		[
			handlePrevMonth,
			handleNextMonth,
			handleYearSelectChange,
			handleMonthSelectChange,
			currentDate,
			years,
		],
	)

	const handleCancel = () => {
		setIsModalVisible(false)
	}

	return (
		<ConfigProvider locale={frFR}>
			<AntCalendar
				headerRender={headerRender}
				value={currentDate}
				dateCellRender={dateCellRender}
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
						<p>Date: {selectedAppointment.date.format('DD/MM/YYYY')}</p>
						<p>Participant: {selectedAppointment.participant}</p>
					</div>
				)}
			</Modal>
		</ConfigProvider>
	)
}

export { Calendar }
