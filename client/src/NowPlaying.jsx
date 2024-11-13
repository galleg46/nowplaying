import React, { useState, useEffect, useRef } from 'react';
import Slide from '@mui/material/Slide';
import style from '@emotion/styled'

function NowPlaying(props) {

    const [current_track, setCurrent_track] = useState(null);
    const [currentTrackId, setCurrentTrackId] = useState(null);
    const [showTrack, setShowTrack] = useState(false);

    useEffect(() => {

        const fetchNowPlaying = async () => {
                    
            try {
    
                // Send the user token to the backend
                const response = await fetch('/now-playing', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: props.token }),
                });
    
                // Parse the response data
                const data = await response.json();

                if (data.item.id !== currentTrackId) {
                    setCurrent_track(data);
                    setCurrentTrackId(data.item.id);
                    setTimeout(() =>  {
                        setShowTrack(true);
                    }, 10000);
                }

            } catch (error) {
                console.error('Error fetching current track data: ', error);
            }
        };

        // Initial call to API at startup
        fetchNowPlaying()

        // Poll every 15 seconds to see if the track has changed
        const intervalId = setInterval(fetchNowPlaying, 10000);
        
        // Clear interval when component unmounts or if the song ID changes
        return () => clearInterval(intervalId);

    }, [currentTrackId, props.token]);

    return (
        <div>
            {current_track ? (
                <div className='main-wrapper'>
                    <div className='container'>
                        <Slide direction='down' in={showTrack}>
                            <div>
                                <img src={current_track.item.album.images[2].url}/>
                                <p>{current_track.item.name} - {current_track.item.artists[0].name}</p>
                            </div>
                        </Slide>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}


export default NowPlaying;