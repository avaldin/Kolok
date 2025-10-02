'use client'

import { useState } from 'react'

export default function ToolPage() {
	const [items, setItems] = useState<{ id: number, name: string, bought: boolean }[]>([])
	const [inputItem, setInputItem] = useState('')
	const [itemId, setItemId] = useState(1)

	const addItem = () => {
		if (inputItem.trim() === '') return
		if (!inputItem.split(/\s+/).some(word => word.length > 20)) {
			setItems(prevArray => [...prevArray, {
				id: itemId,
				name: inputItem,
				bought: false
			}])
			setItemId(itemId + 1)
		} // handle: creer un popup d'erreur

		setInputItem('')
	}
	const toggleBought = (id: number) => {
		setItems(prevArray =>
			prevArray.map(item =>
				item.id === id ? { ...item, bought: !item.bought } : item
			)
		)
		// 	back: handle suppression item
	}

	return (
		<main className="h-screen p-6 bg-peach-yellow flex flex-col items-center">
			<div className="w-full max-w-2xl mb-4 bg-brown-sugar rounded-2xl border-4 border-bistre p-6 shadow-md">
				<h1 className="text-3xl font-extrabold text-bistre text-center">
					Shopping List
				</h1>
			</div>

			<div
				className="w-full max-w-2xl bg-brown-sugar rounded-2xl border-4 border-bistre p-6 shadow-md flex flex-grow flex-col min-h-0">
				<div className="w-full flex gap-x-2">
					<input
						type="text"
						className="flex-1 min-w-0 text-base px-4 py-2 rounded-md border bg-cadet-gray border-bistre focus:outline-none focus:ring-2"
						placeholder="il faut acheter ..."
						value={inputItem}
						onChange={e => setInputItem(e.target.value)}
					/>

					<button
						onClick={addItem}
						className="px-4 py-2 rounded-md border border-bistre bg-atomic-tangerine
						text-bistre font-semibold hover:bg-atomic-tangerine/90 transition"
					>
						+
					</button>
				</div>

				<ul className="space-y-3 my-4 p-2 overflow-y-auto flex-grow min-h-0 shadow-sm">
					{items.length === 0 && (
						<li className="text-cadet-gray italic text-semib font-semibold">Il n'y a rien a acheter</li>
					)}
					{items.map(item => (
						<li
							key={item.id}
							className={`flex items-center gap-2 px-4 py-3 rounded-md border border-bistre 
							bg-atomic-tangerine ${item.bought ? 'line-through text-cadet-gray' : ''}
							`}
						>
							<span className="flex-1 break-words">{`${item.name}`}</span>
							<div className="flex items-center">
								<input
									type="checkbox"
									checked={item.bought}
									onChange={() => toggleBought(item.id)}
									className="w-5 h-5 cursor-pointer bg-cadet-gray appearance-none rounded border border-bistre checked:bg-bistre"
								/>
							</div>
						</li>
					))
					}


				</ul>
			</div>
		</main>
	)
}