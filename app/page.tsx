import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";
import {Header} from "@/components/layout/header"

export default function Home() {
  return (
      <>
          <main className="min-h-screen">
              <Header />
          </main>
      </>
  );
}
