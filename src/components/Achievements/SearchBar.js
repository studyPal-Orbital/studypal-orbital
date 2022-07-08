import React, { useEffect, useState } from "react";

const countries = [
    { name: "Belgium", continent: "Europe" },
    { name: "India", continent: "Asia" },
    { name: "Bolivia", continent: "South America" },
    { name: "Ghana", continent: "Africa" },
    { name: "Japan", continent: "Asia" },
    { name: "Canada", continent: "North America" },
    { name: "New Zealand", continent: "Australasia" },
    { name: "Italy", continent: "Europe" },
    { name: "South Africa", continent: "Africa" },
    { name: "China", continent: "Asia" },
    { name: "Paraguay", continent: "South America" },
    { name: "Usa", continent: "North America" },
    { name: "France", continent: "Europe" },
    { name: "Botswana", continent: "Africa" },
    { name: "Spain", continent: "Europe" },
    { name: "Senegal", continent: "Africa" },
    { name: "Brazil", continent: "South America" },
    { name: "Denmark", continent: "Europe" },
    { name: "Mexico", continent: "South America" },
    { name: "Australia", continent: "Australasia" },
    { name: "Tanzania", continent: "Africa" },
    { name: "Bangladesh", continent: "Asia" },
    { name: "Portugal", continent: "Europe" },
    { name: "Pakistan", continent: "Asia" }
]

const SearchBar = () => {
    const [ userInput, setUserInput ] = useState("")

    const handleUserInput = (e) => {
        setUserInput(() => e.target.value)
    }

    return (
        <div>
            hello
            <input
                value={userInput}
                onChange={handleUserInput}
            />
            {userInput != "" && countries.map((country) => {
                if (country.name.toLocaleLowerCase().match(userInput.toLocaleLowerCase())) {
                    return <p>{country.name}</p>
                }
            })}
        </div>
    )
}
export default SearchBar;