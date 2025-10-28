'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { deleteItem, getItems, postItem } from '../../lib/api';
import { useToast } from '../../lib/toast';
import { useShoppingListSocket } from '../../lib/hooks';

// TODO: Cette page nécessite une refonte complète pour fonctionner avec le nouveau système.
// Options possibles:
// 1. Créer un Context React qui fournit room/userId à toutes les pages
// 2. Refactoriser en route dynamique: app/[roomName]/tools/shopping-list/page.tsx
// 3. Passer roomName via les props depuis MainApp (nécessite restructuration)
export default function ToolPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<string[]>([]);
  const [inputItem, setInputItem] = useState('');
  const [, setLoading] = useState(true);

  // FIXME: storage.getKolokName() n'existe plus - nécessite refonte
  const roomName: string = ''; // storage.getKolokName() ?? ''

  const loadItems = useCallback(async () => {
    try {
      const items = await getItems(roomName);
      setItems(items);
    } catch (e) {
      if (e instanceof Error) showToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [roomName]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  useShoppingListSocket(roomName, loadItems);

  const addItem = async () => {
    try {
      await postItem(roomName, inputItem.trim());
      setItems((prevArray) => [...prevArray, inputItem.trim()]);
      setInputItem('');
    } catch (e) {
      if (e instanceof Error) showToast(e.message, 'error');
      setInputItem('');
    }
  };

  const removeItem = async (itemName: string) => {
    try {
      await deleteItem(roomName, itemName);
      setItems((prevArray) => [
        ...prevArray.filter((item) => item !== itemName),
      ]);
    } catch (e) {
      if (e instanceof Error) showToast(e.message, 'error');
      setInputItem('');
    }
  };

  // const toggleBought = (id: number) => {
  // 	setItems(prevArray =>
  // 		prevArray.map(item =>
  // 			item.id === id ? { ...item, bought: !item.bought } : item
  // 		)
  // 	)
  // 	// 	back: handle suppression item
  // }

  return (
    <main className="h-screen p-6 bg-peach-yellow flex flex-col items-center">
      <div className="w-full max-w-2xl mb-4 bg-brown-sugar rounded-2xl border-4 border-bistre p-6 shadow-md">
        <h1 className="text-3xl font-extrabold text-bistre text-center">
          Shopping List
        </h1>
      </div>

      <div className="w-full max-w-2xl bg-brown-sugar rounded-2xl border-4 border-bistre p-6 shadow-md flex flex-grow flex-col min-h-0">
        <div className="w-full flex gap-x-2">
          <input
            type="text"
            className="flex-1 min-w-0 text-base px-4 py-2 rounded-md border bg-cadet-gray border-bistre focus:outline-none focus:ring-2"
            placeholder="il faut acheter ..."
            value={inputItem}
            onChange={(e) => setInputItem(e.target.value)}
          />

          <button
            onClick={void addItem}
            className="px-4 py-2 rounded-md border border-bistre bg-atomic-tangerine
						text-bistre font-semibold hover:bg-atomic-tangerine/90 transition"
          >
            +
          </button>
        </div>

        <ul className="space-y-3 my-4 p-2 overflow-y-auto flex-grow min-h-0 shadow-sm">
          {items.length === 0 && (
            <li className="text-cadet-gray italic text-semib font-semibold">
              Il n'y a rien a acheter
            </li>
          )}
          {items.map((item) => (
            <li
              key={item}
              className={`flex items-center gap-2 px-4 py-3 rounded-md border border-bistre 
							bg-atomic-tangerine`}
            >
              <span className="flex-1 break-words">{`${item}`}</span>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={false}
                  onChange={() => void removeItem(item)}
                  className="w-5 h-5 cursor-pointer bg-cadet-gray appearance-none rounded border border-bistre checked:bg-bistre"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
