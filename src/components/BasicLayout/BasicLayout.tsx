import { Layout } from 'antd'
import classNames from 'classnames'

import { IBasicLayoutProps } from './BasicLayout-types'

import './BasicLayout-styles.less'

const { Content, Sider } = Layout

export function BasicLayout(props: IBasicLayoutProps) {
	const { children, className, contentClassName, siderClassName, sider, siderWidth = 250 } = props

	return (
		<Layout className={classNames('basic-layout', className)}>
			{sider && (
				<Sider className={classNames('basic-layout__sider', siderClassName)} width={siderWidth}>
					{sider}
				</Sider>
			)}
			<Content className={classNames('basic-layout__content', contentClassName)}>
				{children}
			</Content>
		</Layout>
	)
}
