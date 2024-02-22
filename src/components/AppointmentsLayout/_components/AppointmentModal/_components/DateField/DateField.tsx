import { DatePicker, Space, Typography } from 'antd'
import pickerLocale from 'antd/lib/date-picker/locale/fr_FR'
import dayjs from 'dayjs'
import local_fr from 'dayjs/locale/fr'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import { IDateFieldProps } from './DateField-types'
import { getClassname } from './DateField-utils'

import './DateField-styles.less'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale(local_fr)

export function DateField(props: IDateFieldProps) {
	const { value, label, viewMode, showTime, block } = props

	const date = value ? dayjs(value) : undefined
	const format = showTime ? 'dddd DD MMMM YYYY à HH:mm' : 'dddd DD MMMM YYYY'
	const pickerFormat = showTime ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY'

	if (viewMode) {
		return (
			<Space className={getClassname({ viewMode, block })}>
				{label && <Typography.Text>{label} :</Typography.Text>}
				<Typography.Text>{date ? date.format(format) : null}</Typography.Text>
			</Space>
		)
	} else {
		return (
			<DatePicker
				className={getClassname({ viewMode, block })}
				value={date}
				showTime={showTime}
				format={pickerFormat}
				locale={pickerLocale}
			/>
		)
	}
}
