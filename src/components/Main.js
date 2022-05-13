import React, { useEffect, useRef, useState } from 'react';
import {ReactComponent as SearchIcon} from '../svgs/search.svg'

const clientID = `?client_id=ueEoy8GP_YAe-MTAWJwdHNKFEfWqy0O-kH2meOladvE`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function Main() {

    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [newImages, setNewImages] = useState(false);
    const [photos, setPhotos] = useState([]);
    const mounted = useRef(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!query) return;
        if (page === 1) {
            fetchImages();
        }
        setPage(1);
    }

    const fetchImages = async () => {
        setLoading(true);
        let url;
        const urlPage = `&page=${page}`;
        const urlQuery = `&query=${query}`;
        if (query) {
            url = `${searchUrl}${clientID}${urlPage}${urlQuery}`
        } else {
            url = `${mainUrl}${clientID}${urlPage}`
        }
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data)
            setPhotos(oldPhotos => {
                if (query && page === 1) {
                    return data.results;
                } else if (query) {
                    return [...oldPhotos, ...data.results];
                } else {
                    return [...oldPhotos, ...data];
                }
            })
            setNewImages(false);
            setLoading(false);
        } catch (err) {
            setNewImages(false);
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchImages();
    }, [page])

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            return
        }
        if (!newImages) return
        if (loading) return
        setPage(oldPage => oldPage + 1);
    }, [newImages])

    const event = () => {
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
            setNewImages(true)
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', event);
        return () => window.removeEventListener('scroll', event)
    },[])

    return (
        <main>
            <section className='search'>
                <form className='search-form'>
                    <input 
                        className='form-input' 
                        placeholder="search" 
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <button type='submit' className='submit-btn' onClick={handleSubmit} ><SearchIcon /></button>
                </form>
            </section>
            <section className='photos'>
                <div className='photos-center'>
                    {photos.map((image, index) => {
                        const {urls: {regular}, alt_description, likes, user:{name, portfolio_url, profile_image: {medium}}} = image
                        return (
                            <article className='photo'>
                                <img src={regular} alt={alt_description} />
                                <div className='photo-info'>
                                    <div>
                                        <h4>{name}</h4>
                                        <p>{likes}</p>
                                    </div>
                                    <a href={portfolio_url}>
                                        <img src={medium} alt='' className='user-img'/>
                                    </a>
                                </div>
                            </article>
                        ) ;
                    })}
                    
                </div>
                {loading && <h2 className='loading'>Loading...</h2>}
            </section>
        </main>
    );
}

export default Main;
