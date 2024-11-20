import React, { useState, useEffect, useRef } from 'react';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import style from '@emotion/styled'

function NowPlaying({token, refreshToken, updateTokens }) {

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
                    body: JSON.stringify({ token, refreshToken }),
                });
    
                // Parse the response data
                const data = await response.json();

                if (data.access_token || data.refresh_token) {
                    updateTokens(data.access_token, data.refresh_token);
                    return;
                }


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

    }, [currentTrackId, token, refreshToken]);

    return (

        <div>
            {current_track ? (
                <Slide direction='down' in={showTrack} mountOnEnter unmountOnExit>
                    <Card sx={{ 
                        display: 'flex',  
                        width: '52%', 
                        height: 121,
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 3,
                        boxShadow: 10}}>
                        <CardMedia 
                                component="img" 
                                src={current_track.item.album.images[0].url}
                                sx={{ 
                                    position: 'absolute',
                                    top: '-20px',
                                    left: '-20px',
                                    height: 'calc(100% + 40px)', 
                                    width: 'calc(100% + 40px)', 
                                    objectFit: 'cover',
                                    filter: 'blur(5px)',
                                    zIndex: 0 }} />
                        <Box sx={{ 
                            position: 'relative',
                            zIndex: 1,
                            display: 'flex', 
                            alignItems: 'center',
                            padding: 1,
                            background: 'rgba(0, 0, 0, 0.5)',
                            color: "white",
                            width: '100%' }}>
                            <CardMedia 
                                component="img"
                                src={current_track.item.album.images[2].url}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 1,
                                    marginRight: 2
                                }}/>
                            <Box>
                                <Typography component="div" variant='h6' sx={{ fontWeight: "bold" }}>{current_track.item.name}</Typography>
                                <Typography component="div" variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7' }}>{current_track.item.artists[0].name}</Typography>
                            </Box>
                        </Box>
                    </Card>
                </Slide>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}


export default NowPlaying;