import React, { useState, useEffect, useRef } from 'react';
import Slide from '@mui/material/Slide';
import style from '@emotion/styled'

function NowPlaying(props) {

    const [current_track, setCurrent_track] = useState(null);
    const [currentTrackId, setCurrentTrackId] = useState(null);
    const [showTrack, setShowTrack] = useState(false);
    const [endTimeout, setEndTimeout] = useState(null);

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
                    
                    // Show track and hide after 10 seconds
                    setShowTrack(true);
                    setTimeout(() =>  setShowTrack(false), 10000);

                    // Clear any exisiting timeouts for the previous track
                    if (endTimeout) clearTimeout(endTimeout);

                    // Calculate time remaining and schedule the Slide effect to reappeear 
                    // 15 seconds before the song ends
                    const songDuraton = data.item.duration_ms;
                    const songProgress = data.progress_ms;
                    const timeUntilEnd = songDuraton - songProgress;
                    const timeToTrigger = timeUntilEnd - 15000;

                    if (timeToTrigger > 0) {
                        const timeout = setTimeout(() => {
                            setShowTrack(true);
                            setTimeout(() => setShowTrack(false), 10000);
                        }, timeToTrigger);
                        setEndTimeout(timeout);
                    }
                }

            } catch (error) {
                console.error('Error fetching current track data: ', error);
            }
        };

        // Initial call to API at startup
        fetchNowPlaying()

        // Poll every 15 seconds to see if the track has changed
        const intervalId = setInterval(fetchNowPlaying, 10000);
        
        // Clean up on unmount
        return () => {
            clearInterval(intervalId);
            if (endTimeout) clearTimeout(endTimeout);
        };

    }, [currentTrackId, props.token]);

    return (

        <div className='now-playing__container'>
            <Slide direction='down' in={showTrack} mountOnEnter unmountOnExit>
                <div
                    className='now-playing__wrapper'
                    style={{
                        backgroundImage: current_track ? `url(${current_track.item.album.images[0].url})` : 'none'
                    }}
                >
                    <img src={current_track.item.album.images[2].url} />
                    <p>{current_track.item.name} - {current_track.item.artists[0].name}</p>
                </div>
            </Slide>
        </div>

    );
}


export default NowPlaying;