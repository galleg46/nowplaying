import React, { useState, useEffect } from 'react';

function NowPlaying(props) {

    const [current_track, setCurrent_track] = useState(null);

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
                setCurrent_track(data);
            } catch (error) {
                console.error('Error fetching current track data: ', error);
            }
        }

        fetchNowPlaying();  
    }, [current_track]);

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