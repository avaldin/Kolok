import {OptionButton} from "@/components/ui/optionButton";

function Header() {

    return (
        <header className="bg-bistre mx-auto shadow-2xl flex justify-center">
            <div id="appName" className="justify-between px-6 w-full flex max-w-7xl">
                <h1 className="text-3xl sm:text-4xl font-bold text-cadet-gray">
                    KoloK
                </h1>
            <OptionButton/>
            </div>
        </header>
    )
}

export {Header}