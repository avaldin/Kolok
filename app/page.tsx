
import {Header} from "@/components/layout/header"
import ResumeCard from "@/components/layout/resumeCard";

export default function Home() {
    const kolokName: string = "Coloc Du Plaisir"
    const users: string[] = ["emmy", "antoine", "alan"]
    const tools: string[] = ["liste de courses", "taches", "recette de cuisine"]

  return (
      <>
          <main className="min-h-screen justify-center ">
              <Header />
              <ResumeCard kolokName={kolokName} users={users} tools={tools} />

              <div className="w-5/6 justify-center mt-4 mx-auto p-1.5 max-w-2xl rounded-xl bg-cadet-gray border-bistre border-2">

              </div>
          </main>
      </>
  );
}
