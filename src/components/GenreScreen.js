import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAxiosCall } from "../utils/Axios";
import "../styles/GenreScreen.css";

const GenreScreen = () => {

    const [genres, setGenres] = useState([]);

    const getGenreByBooks = async () => {
        try {
            let response = await getAxiosCall("/get-genres");

            console.log(response)
            setGenres(response);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getGenreByBooks();
    }, []);

    return (
        <div className="genre-list">
            {genres.map((genre, index) => (
                // <button key={index} onClick={() => handleGenreClick(genre)}>{genre}</button>
                <Link to={`${genre}`}>{genre}</Link>
            ))}
        </div>
    );
};

export default GenreScreen;