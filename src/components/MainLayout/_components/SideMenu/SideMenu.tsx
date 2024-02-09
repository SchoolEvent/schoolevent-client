import { Menu } from 'antd'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { useAuth } from '@contexts'

import { getActiveLink, getItems } from './SideMenu-utils'

export function SideMenu() {
	const location = useLocation()
	const { role } = useAuth()

	const items = useMemo(() => getItems(role), [role])

	if (!role) return null

	const activeLink = getActiveLink(location.pathname)

	return <Menu items={items} theme="dark" selectedKeys={[activeLink]} />
}
