import { CaretDown as CaretDownIcon, SignOut as SignOutIcon } from '@phosphor-icons/react'
import { Avatar, Dropdown, Space } from 'antd'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@contexts'
import { capitalize } from '@utils'

import './UserMenu-styles.less'

export function UserMenu() {
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const { signOut, user } = useAuth()
	const navigate = useNavigate()

	const items: ItemType[] = [
		{
			key: 'usermenu-logout',
			icon: <SignOutIcon size="1rem" />,
			label: 'Déconnexion',
			onClick: () => {
				signOut()
				navigate('/login')
			},
		},
	]

	if (!user) {
		return null
	}

	const getFullname = (email: string) => {
		const fullname = email.split('@').shift()!.split('.')
		fullname[0] = capitalize(fullname[0])
		fullname[1] = capitalize(fullname[1])

		return fullname.join(' ')
	}

	const fullname = getFullname(user.email!)
	const initials = fullname.split(' ')[0].charAt(0) + fullname.split(' ')[1].charAt(0)

	return (
		<Space direction="horizontal" className={`user-menu${isOpen ? ' user-menu__active' : ''}`}>
			<Avatar>{initials}</Avatar>
			{fullname}
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
