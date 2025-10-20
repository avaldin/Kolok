'use client';

import { Home, Settings, User } from 'lucide-react'
import { useState } from 'react'
import { storage } from '../../lib/storage'
import { quitRoom } from '../../services/api'
import { useToast } from './Toast'


function OptionButton() {
	const { showToast } = useToast()
    const [isOpen, setIsOpen] = useState(false);

    const handleChangeName = async () => {
        await handleChangeKolok()
		storage.clearUserName();
        window.location.reload();
    };

    const handleChangeKolok = async () => {
        try {
		await quitRoom(storage.getKolokName() ?? '')
		storage.clearKolokName();
		window.location.reload();
		} catch (e) {
			if (e instanceof Error)
				showToast(e.message, 'error')
		}
    };

    return (
        <div className="relative flex items-center">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center m-1 p-1 bg-brown-sugar rounded-md shadow-amber-200 hover:bg-atomic-tangerine transition-colors"
                aria-label="Options"
            >
                <Settings />
            </button>

            <div
                className={`absolute right-0 top-full mt-1 bg-brown-sugar rounded-md shadow-lg overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
                style={{ minWidth: '200px' }}
            >
                <div className="flex flex-col p-2 gap-2">
                    <button
                        onClick={handleChangeName}
                        className="flex items-center gap-2 px-4 py-2 bg-atomic-tangerine rounded-md hover:bg-peach-yellow transition-colors text-bistre font-medium"
                    >
                        <User size={18} />
                        Changer de nom
                    </button>
                    <button
                        onClick={handleChangeKolok}
                        className="flex items-center gap-2 px-4 py-2 bg-atomic-tangerine rounded-md hover:bg-peach-yellow transition-colors text-bistre font-medium"
                    >
                        <Home size={18} />
                        Changer de kolok
                    </button>
                </div>
            </div>
        </div>
    )
}
export {OptionButton}