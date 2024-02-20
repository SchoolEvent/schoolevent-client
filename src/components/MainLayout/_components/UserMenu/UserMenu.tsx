import { CaretDown as CaretDownIcon, SignOut as SignOutIcon } from '@phosphor-icons/react'
import { Avatar, Dropdown, Space } from 'antd'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import { useState } from 'react'

import { useAuth } from '@contexts'
import { getNameFromEmail, useSupabase } from '@utils'

import './UserMenu-styles.less'

export function UserMenu() {
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const { user } = useAuth()
	const supabase = useSupabase()

	const items: ItemType[] = [
		{
			key: 'usermenu-logout',
			icon: <SignOutIcon size="1rem" />,
			label: 'Déconnexion',
			onClick: () => {
				supabase.auth.signOut()
			},
		},
	]

	if (!user) {
		return null
	}

	const { name, initials } = getNameFromEmail(user.email!)

	return (
		<Space direction="horizontal" className={`user-menu${isOpen ? ' user-menu__active' : ''}`}>
			<Avatar>{initials}</Avatar>
			{name}
			<Dropdown
				menu={{ items }}
				className="user-menu__dropdown"
				onOpenChange={(open) => {
					setIsOpen(open)
				}}
				trigger={['click']}
			>
				<i className="user-menu__icon">
					<CaretDownIcon size="1rem" />
				</i>
			</Dropdown>
		</Space>
	)
}
