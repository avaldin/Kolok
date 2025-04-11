import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";
import {Header} from "@/components/layout/header"
import ResumeCard from "@/components/layout/resumeCard";

export default function Home() {
  return (
      <>
          <main className="min-h-screen justify-center ">
              <Header />
              <ResumeCard kolokName="Coloc Du Plaisir" tools={["liste de courses", "taches", "recette de cuisine"]} />
          </main>
      </>
  );
}
