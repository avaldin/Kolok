'use client'

import  {useState} from "react";

const ResumeCard = ({kolokName = "KolokName", users, tools = []}: {kolokName: string, users: string[], tools: string[]}) => {

    return (
        <div className="w-5/6 justify-center mt-4 mx-auto p-1.5 max-w-2xl bg-brown-sugar rounded-xl border-bistre border-6">
            <div className="text-cadet-gray ">
                <h2 className="text-xl font-extrabold text">{kolokName}</h2>
            </div>

            <div className="p-2 justify-center flex space-x-20">
                <div className="flex items-center justify-between">
                    <ul>
                        {users.map((user, index) => (
                            <li key={index} className="flex text-bistre items-center space-x-2">
                                <span className="w-3 h-3 bg-bistre rounded-full flex-shrink-0"></span>
                                <span>{user}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex items-center justify-between">
                    <ul className="space-y-1">
                        {tools.map((tools, index) => (
                            <li key={index}>
                                <div className="bg-atomic-tangerine rounded-xl text-center px-1 border-bistre border-1">
                                    <span>{tools}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ResumeCard;