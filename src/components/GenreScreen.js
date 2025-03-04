import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAxiosCall } from "../utils/Axios";
import { showToast } from '../utils/toast';
import "../styles/GenreScreen.css";

const GenreScreen = () => {
    const [genres, setGenres] = useState([]);

    const getGenreByBooks = async () => {
        try {
            let response = await getAxiosCall("/get-genres");
            // console.log(response);

            // Sort genres alphabetically
            const sortedGenres = response.sort((a, b) => a.localeCompare(b));
            setGenres(sortedGenres);
        } catch (error) {
            // console.log(error);
            showToast("Failed to fetch genres", "error");
        }
    };

    useEffect(() => {
        getGenreByBooks();
    }, []);

    // Split genres into two columns
    const splitGenresIntoColumns = (genres) => {
        const midIndex = Math.ceil(genres.length / 2);
        const firstColumn = genres.slice(0, midIndex);
        const secondColumn = genres.slice(midIndex);
        return [firstColumn, secondColumn];
    };

    const [firstColumn, secondColumn] = splitGenresIntoColumns(genres);

    return (
        <div className="genre-screen">
            <h2>Genres</h2>
            <div className="genre-table">
                <div className="genre-column">
                    {firstColumn?.map((genre, index) => (
                        <Link to={`${genre}`} key={index} className="genre-link">
                            {genre}
                        </Link>
                    ))}
                </div>
                <div className="genre-column">
                    {secondColumn?.map((genre, index) => (
                        <Link to={`${genre}`} key={index + firstColumn.length} className="genre-link">
                            {genre}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GenreScreen;