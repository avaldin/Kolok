'use client'

import dynamic from 'next/dynamic'

const AppRouter = dynamic(() => import('./components/AppRouter'), {
	ssr: false,
	loading: () => (
		<main className="flex min-h-screen items-center justify-center">
			<p>chargement...</p>
		</main>
	)
})



export default function Home() {
	return<AppRouter />
}
