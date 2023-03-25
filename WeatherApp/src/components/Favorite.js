import React, { useState } from "react";

function FavoriteLocations({ favoriteLocations, setFavoriteLocations }) {
  const [newFavoriteLocation, setNewFavoriteLocation] = useState("");

  const addFavoriteLocation = () => {
    if (newFavoriteLocation !== "") {
      const newFavoriteLocations = [...favoriteLocations, newFavoriteLocation];
      setFavoriteLocations(newFavoriteLocations);
      localStorage.setItem(
        "favoriteLocations",
        JSON.stringify(newFavoriteLocations)
      );
      setNewFavoriteLocation("");
    }
  };

  const removeFavoriteLocation = (index) => {
    const newFavoriteLocations = favoriteLocations.filter(
      (_, i) => i !== index
    );
    setFavoriteLocations(newFavoriteLocations);
    localStorage.setItem(
      "favoriteLocations",
      JSON.stringify(newFavoriteLocations)
    );
  };

  return (
    <div className="favorite">
      <h2 className="favoriteh2">Favorite Locations</h2>
      <ul className="favList">
        {favoriteLocations.map((location, index) => (
          <li key={index}>
            {location}
            <button className="removeIcon" onClick={() => removeFavoriteLocation(index)}>X</button>
          </li>
        ))}
      </ul>
      <div className="fixed">
        <input
         className="searchfavorite"
          type="text"
          value={newFavoriteLocation}
          onChange={(e) => setNewFavoriteLocation(e.target.value)}
        />
        <button className="searchfavorite searchfavButton"  onClick={() => addFavoriteLocation()}>Add Favorite Locations</button>
      </div>
    </div>
  );
}

export default FavoriteLocations;
