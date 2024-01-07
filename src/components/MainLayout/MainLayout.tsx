import { ArrowLeft } from '@phosphor-icons/react'
import { Layout } from 'antd'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { IconButton } from '@components'
import { useAuth } from '@contexts'

import { SideMenu, UserMenu } from './_components'

import './MainLayout-styles.less'

const { Content, Header, Sider } = Layout

export function MainLayout() {
	const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
	const { user } = useAuth()
	const navigate = useNavigate()

	const toggleSider = () => {
		setIsCollapsed((prevState) => !prevState)
	}

	useEffect(() => {
		if (!user) {
			navigate('/login')
		}
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<Layout className="main-layout">
			<Sider
				className="main-layout__sider"
				trigger={null}
				width={200}
				collapsible
				collapsed={isCollapsed}
			>
				<div className="sider__logo">
					<img src="schoolevent_logo_white.svg" />
					<img src="schoolevent_text_white.svg" />
				</div>
				<SideMenu />
			</Sider>
			<Layout>
				<Header className="main-layout__header">
					<IconButton
						icon={<ArrowLeft size="1rem" />}
						onClick={toggleSider}
						className={isCollapsed ? 'sider-trigger__collapsed' : 'sider-trigger'}
					/>
					<UserMenu />
				</Header>
				<Content className="main-layout__content">
					<Outlet />
				</Content>
			</Layout>
		</Layout>
	)
}
