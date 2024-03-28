import React from 'react'

const tabs = ["home", "team", "profile"];

function Navbar({ currTab, setTab }) {

    // Styles
    const selected = {
        button: "inline-flex flex-col items-center justify-center px-5 bg-gray-50 dark:bg-gray-800 group",
        svg: "w-5 h-5 mb-2 text-blue-600 dark:text-blue-500",
        span: "text-sm capitalize text-gray-500 text-blue-600 dark:text-blue-500"
    }

    const unselected = {
        button: "inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group",
        svg: "w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500",
        span: "text-sm capitalize text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
    }

    return (
        <div>
            <div class="fixed bottom-0 left-0 z-50 w-full h-20 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                <div class="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
                    <button type="button" onClick={() => setTab(0)} class={currTab === 0 ? selected.button : unselected.button}>
                        <svg class={currTab === 0 ? selected.svg : unselected.svg} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                        </svg>
                        <span class={currTab === 0 ? selected.span : unselected.span}>{tabs[0]}</span>
                    </button>
                    <button type="button" onClick={() => setTab(1)} class={currTab === 1 ? selected.button : unselected.button}>
                        <svg class={currTab === 1 ? selected.svg : unselected.svg} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M18 2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2ZM2 18V7h6.7l.4-.409A4.309 4.309 0 0 1 15.753 7H18v11H2Z"/>
                            <path d="M8.139 10.411 5.289 13.3A1 1 0 0 0 5 14v2a1 1 0 0 0 1 1h2a1 1 0 0 0 .7-.288l2.886-2.851-3.447-3.45ZM14 8a2.463 2.463 0 0 0-3.484 0l-.971.983 3.468 3.468.987-.971A2.463 2.463 0 0 0 14 8Z"/>
                        </svg>
                        <span class={currTab === 1 ? selected.span : unselected.span}>{tabs[1]}</span>
                    </button>
                    <button type="button" onClick={() => setTab(2)} class={currTab === 3 ? selected.button : unselected.button}>
                        <svg class={currTab === 2 ? selected.svg : unselected.svg} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                        </svg>
                        <span class={currTab === 3 ? selected.span : unselected.span}>{tabs[2]}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Navbar