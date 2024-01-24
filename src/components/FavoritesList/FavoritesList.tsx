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
	const { favorites, loading, removeFavorite } = useFavorites()
	const { user } = useAuth()

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
							title={item.school_name}
							description={
								<Flex justify="space-between">
									<i>
										{item.school_city} - {item.school_postal_code}
									</i>
									<Popconfirm
										title="Supprimer des favoris ?"
										placement="right"
										okType="danger"
										okText="Supprimer"
										okButtonProps={{ danger: true }}
										onConfirm={() => removeFavorite(item.school_id)}
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

function LoadingList() {
	return (
		<Space className="favorites-list" direction="vertical">
			<Input placeholder="Rechercher des favoris" prefix={<SearchIcon />} />
			<List dataSource={[]} loading />
		</Space>
	)
}
