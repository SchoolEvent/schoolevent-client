import { DatePicker, Space, Typography } from 'antd'
import pickerLocale from 'antd/lib/date-picker/locale/fr_FR'
import dayjs from 'dayjs'
import local_fr from 'dayjs/locale/fr'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import { TDateFieldProps } from './DateField-types'
import { getClassname } from './DateField-utils'

import './DateField-styles.less'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale(local_fr)

export function DateField(props: TDateFieldProps) {
	const { readOnly, label, block, ...restProps } = props

	const date = restProps.value ? dayjs(restProps.value) : undefined
	const format = restProps.showTime ? 'dddd DD MMMM YYYY à HH:mm' : 'dddd DD MMMM YYYY'
	const pickerFormat = restProps.showTime ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY'

	if (readOnly) {
		return (
			<Space className={getClassname({ readOnly, block })}>
				{label && <Typography.Text>{label} :</Typography.Text>}
				<Typography.Text>{date ? date.format(format) : null}</Typography.Text>
			</Space>
		)
	} else {
		return (
			<DatePicker
				{...restProps}
				className={getClassname({ readOnly, block })}
				format={pickerFormat}
				locale={pickerLocale}
			/>
		)
	}
}
