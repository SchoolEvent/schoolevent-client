import { CaretDown as CaretDownIcon, SignOut as SignOutIcon } from '@phosphor-icons/react'
import { Avatar, Dropdown, Space } from 'antd'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import { useState } from 'react'

import { useAuth } from '@contexts'
import { capitalize } from '@utils'

import './UserMenu-styles.less'

export function UserMenu() {
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const { signOut, user } = useAuth()

	const items: ItemType[] = [
		{
			key: 'usermenu-logout',
			icon: <SignOutIcon size="1rem" />,
			label: 'Déconnexion',
			onClick: () => {
				signOut()
			},
		},
	]

	if (!user) {
		return null
	}

	const getFullname = (email: string) => {
		const splittedEmail = email.split('@')

		if (splittedEmail[0].includes('.')) {
			const fullname = splittedEmail.shift()!.split('.')
			fullname[0] = capitalize(fullname[0])
			fullname[1] = capitalize(fullname[1])

			const name = fullname.join(' ')

			return { name, initials: name.split(' ')[0].charAt(0) + name.split(' ')[1].charAt(0) }
		} else {
			const name = capitalize(splittedEmail[0])
			return { name, initials: name.charAt(0) }
		}
	}

	const { name, initials } = getFullname(user.email!)

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
