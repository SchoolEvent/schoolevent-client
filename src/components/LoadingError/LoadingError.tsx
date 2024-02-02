import { Warning as ErrorIcon } from '@phosphor-icons/react'
import { Space, Typography } from 'antd'

import { ILoadingErrorProps } from './LoadingError-types'

import './LoadingError-styles.less'

export function LoadingError({ error }: ILoadingErrorProps) {
	return (
		<Space className="loading-error" size="small" direction="vertical" align="center">
			<ErrorIcon size={48} fill="var(--ant-color-error)" />
			<Space direction="vertical" size="large" align="center">
				<Typography.Title level={5} type="danger">
					Erreur lors du chargement.
				</Typography.Title>
				<Typography.Text code>{error}</Typography.Text>
			</Space>
		</Space>
	)
}
