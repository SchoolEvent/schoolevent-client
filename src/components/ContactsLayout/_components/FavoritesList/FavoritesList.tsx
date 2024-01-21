import {
	Trash as DeleteIcon,
	MagnifyingGlass as SearchIcon,
	WarningCircle,
} from '@phosphor-icons/react'
import { Button, Flex, Input, List, Popconfirm, Space } from 'antd'
import { useState } from 'react'

import { useAuth, useFavorites } from '@contexts'

import './FavoritesList-styles.less'

/**
 * This component **MUST** be wrapped in a `FavoritesProvider` context.
 */
export function FavoritesList() {
	const [search, setSearch] = useState('')
	const { favorites, loading, deleteFavorite } = useFavorites()
	const { user } = useAuth()

	if (!user) {
		return null
	}

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value)
	}

	const filteredFavorites = favorites.filter((favorite) => {
		const matchName = favorite.name.toLowerCase().includes(search.toLowerCase())
		const matchCity = favorite.city.toLowerCase().includes(search.toLowerCase())
		const matchPostalCode = favorite.postalCode.toLowerCase().includes(search.toLowerCase())

		return matchName || matchCity || matchPostalCode
	})

	return (
		<Space className="favorites-list" direction="vertical">
			<Input
				placeholder="Rechercher des favoris"
				prefix={<SearchIcon />}
				onChange={handleSearchChange}
			/>
			<List
				dataSource={filteredFavorites}
				loading={loading}
				renderItem={(item) => (
					<List.Item key={item.id}>
						<List.Item.Meta
							className="favorites-list__item"
							title={item.name}
							description={
								<Flex justify="space-between">
									<i>
										{item.city} - {item.postalCode}
									</i>
									<Popconfirm
										title="Supprimer des favoris ?"
										placement="right"
										okType="danger"
										okText="Supprimer"
										okButtonProps={{ danger: true }}
										onConfirm={() => deleteFavorite(item.id, user.id)}
										cancelText="Annuler"
										icon={<WarningCircle className="warning-icon" size="1rem" />}
									>
										<Button
											className="favorite-delete-button"
											icon={<DeleteIcon size="1rem" />}
											type="text"
											danger
										/>
									</Popconfirm>
								</Flex>
							}
						/>
					</List.Item>
				)}
			/>
		</Space>
	)
}
