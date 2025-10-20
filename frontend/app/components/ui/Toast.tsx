'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { X } from 'lucide-react'

type ToastType = 'error' | 'success' | 'info'

interface Toast {
	id: number
	message: string
	type: ToastType
}

interface ToastContextType {
	showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
	const context = useContext(ToastContext)
	if (!context) {
		throw new Error('useToast doit être utilisé dans un ToastProvider')
	}
	return context
}

interface ToastProviderProps {
	children: ReactNode
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
	const [toasts, setToasts] = useState<Toast[]>([])
	const [nextId, setNextId] = useState(0)

	const showToast = useCallback((message: string, type: ToastType = 'error') => {
		const id = nextId
		setNextId(nextId + 1)
		setToasts(prev => [...prev, { id, message, type }])

		// Auto-remove après 5 secondes
		setTimeout(() => {
			setToasts(prev => prev.filter(toast => toast.id !== id))
		}, 5000)
	}, [nextId])

	const removeToast = (id: number) => {
		setToasts(prev => prev.filter(toast => toast.id !== id))
	}

	const getToastStyles = (type: ToastType) => {
		switch (type) {
			case 'error':
				return 'bg-red-600 border-red-800'
			case 'success':
				return 'bg-green-600 border-green-800'
			case 'info':
				return 'bg-blue-600 border-blue-800'
			default:
				return 'bg-brown-sugar border-bistre'
		}
	}

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			<div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2 w-11/12 max-w-md">
				{toasts.map(toast => (
					<div
						key={toast.id}
						className={`${getToastStyles(toast.type)} text-white px-4 py-3 rounded-lg border-2 shadow-lg flex items-center justify-between animate-slideIn`}
					>
						<p className="text-sm font-medium">{toast.message}</p>
						<button
							onClick={() => removeToast(toast.id)}
							className="ml-4 hover:opacity-80 transition"
							aria-label="Fermer"
						>
							<X size={18} />
						</button>
					</div>
				))}
			</div>
		</ToastContext.Provider>
	)
}
