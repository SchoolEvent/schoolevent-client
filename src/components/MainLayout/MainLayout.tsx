import { ArrowLeft, MapPin } from '@phosphor-icons/react'
import { Layout } from 'antd'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { IconButton } from '@components'
import { useAuth } from '@contexts'
import { useLocalStorage } from '@utils'

import { SideMenu, UserMenu } from './_components'

import './MainLayout-styles.less'

const { Content, Header, Sider } = Layout

export function MainLayout() {
	const localStorage = useLocalStorage()
	const [isCollapsed, setIsCollapsed] = useState<boolean>(
		localStorage.get('sidebar.isCollapsed', false) as boolean,
	)
	const { user } = useAuth()
	const navigate = useNavigate()

	const toggleSider = () => {
		localStorage.set({ key: 'sidebar.isCollapsed', data: !isCollapsed })
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
					<img alt="schoolevent_logo" src="schoolevent_logo_white.svg" />
					{/* TODO: fix logo layout when collapsed */}
					{isCollapsed ? null : (
						<img alt="schoolevent_text_logo" src="schoolevent_text_white.svg" />
					)}
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
					<MapPin size={32} weight="duotone" />
					<UserMenu />
				</Header>
				<Content className="main-layout__content">
					<Outlet />
				</Content>
			</Layout>
		</Layout>
	)
}
