import React, { useState, useEffect } from 'react';

function NowPlaying(props) {

    const [current_track, setCurrent_track] = useState(null);
    const [currentTrackId, setCurrentTrackId] = useState(null);

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
                <div>
                    <h2>Now Playing: {current_track.item.album.name}</h2>
                    <img src={current_track.item.album.images[0].url}/>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}


export default NowPlaying;