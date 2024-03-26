import "./App.css";
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/tabs/Home";
import Team from "./components/tabs/Team";
import Settings from "./components/tabs/Settings";
import Profile from "./components/tabs/Profile";

const tabs = ["home", "team", "settings", "profile"];

function App() {
	let [currentTab, setCurrentTab] = React.useState(tabs[0]);

	return (
		<div className="App">
			<div className="flex justify-center items-center">
				{currentTab === 0 && <Home />}
				{currentTab === 1 && <Team />}
				{currentTab === 2 && <Settings />}
				{currentTab === 3 && <Profile />}
			</div>

			<Navbar currTab={currentTab} setTab={setCurrentTab} />
		</div>
	);
}

export default App;
