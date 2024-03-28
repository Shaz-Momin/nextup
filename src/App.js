import "./App.css";
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/tabs/Home";
import Team from "./components/tabs/Team";
import Settings from "./components/tabs/Settings";
import Profile from "./components/tabs/Profile";
import Login from "./components/tabs/Login";
import CreateTeam from "./components/CreateTeam";
import { Routes, Route } from "react-router-dom";
import SportPage from "./components/SportPage";

// const tabs = ["home", "team", "settings", "profile"];

function App() {
	let [currentTab, setCurrentTab] = useState(0);
	let [loggedIn, setLoggedIn] = useState(false);
	let [selectedSport, setSelectedSport] = useState(null);

	const login = () => {
		setLoggedIn(true);
	};

	const handleSelectSport = (sport) => {
		setSelectedSport(sport);
	};

	return (
		<div className="App">
			{loggedIn ? (
				<>
					<div className="flex justify-center items-center w-full">
						{selectedSport === null ? (
							<>
								{currentTab === 0 && (
									<Home onSelectSport={handleSelectSport} />
								)}
								{currentTab === 1 && <Team />}
								{currentTab === 2 && <Settings />}
								{currentTab === 3 && <Profile />}
							</>
						) : (
							<SportPage
								sport={selectedSport}
								onBack={() => setSelectedSport(null)}
								createTeam={() => {
									setCurrentTab(1);
									setSelectedSport(null);
								}}
							/>
						)}
					</div>
					{selectedSport === null && (
						<Navbar currTab={currentTab} setTab={setCurrentTab} />
					)}
				</>
			) : (
				<Login login={login} />
			)}
		</div>
	);
}

export default App;
