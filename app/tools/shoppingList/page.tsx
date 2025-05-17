export default function ToolPage({ params }: { params: { tool: string } }) {
	return (
		<main className="min-h-screen p-6">
			<h1 className="text-3xl font-bold text-bistre">
				Bienvenue sur l'outil : {params.tool}
			</h1>
			{/* Ajoute ici l'affichage dynamique selon l'outil */}
		</main>
	)
}