import {
	Trash as DeleteIcon,
	DotsThreeVertical as MoreIcon,
	Plus as PlusIcon,
	MagnifyingGlass as SearchIcon,
} from '@phosphor-icons/react'
import { Dropdown, Flex, Input, List, Space, Typography } from 'antd'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth, useFavorites } from '@contexts'

import { IconButton } from '../IconButton/IconButton'

import './FavoritesList-styles.less'

/**
 * This component **MUST** be wrapped in a `FavoritesProvider` context.
 */
export function FavoritesList() {
	const [search, setSearch] = useState('')
	const { favorites, loading, removeFavorite } = useFavorites()
	const { user } = useAuth()
	const navigate = useNavigate()

	if (!user) {
		return null
	}

	if (loading) {
		return <LoadingList />
	}

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value)
	}

	const filteredFavorites = favorites.filter((favorite) => {
		const matchName = favorite.school_name.toLowerCase().includes(search.toLowerCase())
		const matchCity = favorite.school_city.toLowerCase().includes(search.toLowerCase())
		const matchPostalCode = favorite.school_postal_code.toLowerCase().includes(search.toLowerCase())

		return matchName || matchCity || matchPostalCode
	})

	const getMenuItems = (school_id: string): ItemType[] => [
		{
			key: 'create-follow-up',
			label: 'Créer un suivi',
			icon: <PlusIcon size={16} weight="bold" />,
			onClick: () => navigate(`/appointments?action=new&school_id=${school_id}`),
		},
		{
			key: 'delete-favorite',
			label: 'Supprimer des favoris',
			icon: <DeleteIcon size={16} weight="bold" />,
			danger: true,
			onClick: () => removeFavorite(school_id),
		},
	]

	return (
		<Space className="favorites-list" direction="vertical">
			<Typography.Title className="favorites-list__title" level={5}>
				Établissements favoris
			</Typography.Title>
			<Input
				placeholder="Rechercher des favoris"
				prefix={<SearchIcon />}
				onChange={handleSearchChange}
			/>
			<List
				locale={{ emptyText: 'Aucun favoris' }}
				dataSource={filteredFavorites}
				loading={loading}
				renderItem={(item) => (
					<List.Item key={item.id}>
						<List.Item.Meta
							className="favorites-list__item"
							title={item.school_name}
							description={
								<Flex justify="space-between">
									<i>
										{item.school_city} - {item.school_postal_code}
									</i>
									<Dropdown menu={{ items: getMenuItems(item.school_id) }} trigger={['click']}>
										<IconButton type="text" icon={<MoreIcon size={16} weight="bold" />} />
									</Dropdown>
								</Flex>
							}
						/>
					</List.Item>
				)}
			/>
		</Space>
	)
}

function LoadingList() {
	return (
		<Space className="favorites-list" direction="vertical">
			<Input placeholder="Rechercher des favoris" prefix={<SearchIcon />} />
			<List dataSource={[]} loading />
		</Space>
	)
}
