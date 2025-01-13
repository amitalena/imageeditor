import { AppBar, Box, Button, Card, CardContent, CardMedia, Grid, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchImages } from "../services/imageServices";

export default function HomePage() {
    const [images, setImages] = useState<{ id: number; url: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchFocused, setSearchFocused] = useState<boolean>(false);
    const [showImages, setShowImages] = useState<boolean>(false); // State to control image box visibility
    const navigate = useNavigate();

    // Handle search functionality
    const handleSearch = async () => {
        if (!searchQuery.trim()) return; // Prevent empty searches
        setLoading(true);
        setError(null);
        try {
            const fetchedImages = await fetchImages(searchQuery, 15);
            setImages(fetchedImages);
            setShowImages(true); // Show image box after search
        } catch (err) {
            console.log("try again", err)
            setError('Failed to fetch images. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AppBar variant="elevation" elevation={0} color="default" position="fixed">
                <Toolbar>
                    <Stack direction={"row"} alignItems={"center"} width="100%">
                        <Typography
                            flex={1}
                            variant="h6"
                            component="div"
                            sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                        >
                            Pic Editor
                        </Typography>
                        <Stack
                            flex={1}
                            direction={"row"}
                            spacing={2}
                            alignItems={"center"}
                            justifyContent="space-between"
                            sx={{
                                transition: "all 0.3s ease-in-out",
                                width: searchFocused ? "100%" : "auto",
                            }}
                        >
                            <TextField
                                fullWidth
                                size="small"
                                label="Search"
                                variant="outlined"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                sx={{
                                    width: searchFocused ? "100%" : "200px",
                                    transition: "all 0.3s ease-in-out",
                                }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSearch}
                                size="small"
                                disabled={loading}
                            >
                                {loading ? "Searching..." : "Search"}
                            </Button>
                        </Stack>
                    </Stack>
                </Toolbar>
            </AppBar>
            <Toolbar />
            <Box>
                {/* Only show image box after search */}
                {showImages && (
                    <Card variant="outlined">
                        <CardContent>
                            <Stack rowGap={2}>
                                {/* Error Message */}
                                {error && <div style={{ color: 'red' }}>{error}</div>}
                                {/* Image Grid */}
                                <Grid container spacing={2}>
                                    {images.map((image) => (
                                        <Grid item xs={12} sm={6} md={3} key={image.id}>
                                            <Card variant="outlined">
                                                <Box sx={{ position: 'relative' }}>
                                                    <CardMedia
                                                        component="img"
                                                        height="240"
                                                        image={image.url}
                                                        alt={`Image ${image.id}`}
                                                    />
                                                    <Button
                                                        sx={{
                                                            position: 'absolute',
                                                            bottom: 16,
                                                            right: 16,
                                                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                            color: 'white',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                                            },
                                                        }}
                                                        variant="contained"
                                                        onClick={() => navigate(`/canvas/${encodeURIComponent(image.url)}`)}
                                                    >
                                                        Add Caption
                                                    </Button>
                                                </Box>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Stack>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </>
    );
}
