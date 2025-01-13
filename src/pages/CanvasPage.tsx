import {
    ChangeHistoryOutlined,
    CircleOutlined,
    ClearAllOutlined,
    DeleteOutlineOutlined,
    HexagonOutlined,
    LayersOutlined,
    RectangleOutlined,
    TextDecreaseOutlined,
    TextIncreaseOutlined,
    TitleOutlined,
} from "@mui/icons-material";
import { Button, TextField, Stack, Grid, Box, Typography } from "@mui/material";
import *as fabric from "fabric";
import { useEffect, useState, useRef, useCallback } from "react";
import { RiBringToFront } from "react-icons/ri";
import { useParams } from "react-router-dom";

function CanvasPage(): JSX.Element {
    const { imageurl } = useParams<{ imageurl: string }>();
    const canvasRef = useRef<fabric.Canvas | null>(null);
    const [color, setColor] = useState("#000000");
    const [textSize, setTextSize] = useState(20);
    useEffect(() => {
        const canvas = new fabric.Canvas("canvas", {
            preserveObjectStacking: true,
            selection: true,
        });
        canvasRef.current = canvas;

        if (imageurl) {
            fabric.Image.fromURL(imageurl, (img) => {
                if (img) {
                    img.filters?.push(new fabric.Image.filters.Grayscale());
                    img.applyFilters();
                    canvas.add(img);
                }
            });
        }

        canvas.on("object:selected", (event) => {
            const activeObject = event.target as fabric.Object;
            if (activeObject) {
                activeObject.set({
                    borderColor: "blue",
                    cornerColor: "blue",
                    cornerSize: 8,
                    transparentCorners: false,
                });
                canvas.renderAll();
            }
        });

        return () => {
            canvas.dispose();
            canvasRef.current = null;
        };
    }, [imageurl]);

    const addObject = useCallback((object: fabric.Object) => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.add(object).setActiveObject(object);
            canvas.renderAll();
        }
    }, []);

    const addText = useCallback(() => {
        const text = new fabric.Textbox("Edit me", {
            left: 50,
            top: 50,
            fontSize: 20,
            editable: true,
            width: 150,
        });
        addObject(text);
    }, [addObject, color, textSize]);

    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setColor(event.target.value);
    };

    const increaseTextSize = () => {
        setTextSize((prev) => Math.min(prev + 2, 100)); // Max size is 100
    };

    const decreaseTextSize = () => {
        setTextSize((prev) => Math.max(prev - 2, 10)); // Min size is 10
    };

    const addShape = useCallback(
        (type: "circle" | "rectangle" | "triangle" | "polygon") => {
            const shapes: Record<string, fabric.Object> = {
                circle: new fabric.Circle({
                    radius: 50,
                    fill: "red",
                    left: 100,
                    top: 100,
                }),
                rectangle: new fabric.Rect({
                    width: 100,
                    height: 50,
                    fill: "blue",
                    left: 150,
                    top: 150,
                }),
                triangle: new fabric.Triangle({
                    width: 100,
                    height: 100,
                    fill: "green",
                    left: 200,
                    top: 200,
                }),
                polygon: new fabric.Polygon(
                    [
                        { x: 150, y: 50 },
                        { x: 200, y: 100 },
                        { x: 200, y: 180 },
                        { x: 150, y: 230 },
                        { x: 100, y: 180 },
                        { x: 100, y: 100 },
                    ],
                    {
                        fill: "purple",
                        left: 250,
                        top: 250,
                    }
                ),
            };
            const shape = shapes[type];
            if (shape) addObject(shape);
        },
        [addObject]
    );

    const deleteObject = useCallback(() => {
        const canvas = canvasRef.current;
        const activeObject = canvas?.getActiveObject();
        if (canvas && activeObject) {
            canvas.remove(activeObject);
            canvas.renderAll();
        }
    }, []);

    const clearCanvas = useCallback(() => {
        canvasRef.current?.clear();
    }, []);

    const adjustZIndex = useCallback((action: "forward" | "backward") => {
        const canvas = canvasRef.current;
        const activeObject = canvas?.getActiveObject();
        if (canvas && activeObject) {
            if (action === "forward") {
                canvas.bringForward(activeObject);
            } else {
                canvas.sendBackwards(activeObject);
            }
            canvas.renderAll();
        }
    }, []);

    const downloadCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const dataURL = canvas.toDataURL({ format: "png", quality: 1 });
            const link = document.createElement("a");
            link.href = dataURL;
            link.download = "canvas-image.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); // Cleanup
        }
    }, []);

    return (
        <Box sx={{ height: '100vh', width: "100%", p: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} lg={9}>
                    <canvas
                        id="canvas"
                        width={800}
                        height={500}
                        style={{ border: "1px solid #000" }}
                    />
                </Grid>
                <Grid item xs={12} lg={3}>
                    <Stack direction="column" spacing={2}>
                        <Box>

                            <Stack alignItems={'center'} direction="row" spacing={2}>
                                <Typography>Color:</Typography>
                                <TextField
                                    size="small"
                                    type="color"
                                    value={color}
                                    onChange={(e) => handleColorChange(e.target.value)}
                                    fullWidth
                                />
                            </Stack>
                            <Stack alignItems={'center'} sx={{ my: 2 }} direction="row" spacing={2}>
                                <Typography>Size:</Typography>
                                <Box display="flex" gap={2}>
                                    <Button size="small" variant="outlined" onClick={decreaseTextSize}>
                                        <TextDecreaseOutlined />
                                    </Button>
                                    <Button size="small" variant="outlined" onClick={increaseTextSize}>
                                        <TextIncreaseOutlined />
                                    </Button>
                                </Box>
                            </Stack>

                            <Box display="flex" gap={2}>
                                <Button variant="outlined" onClick={addText}>
                                    Text <TitleOutlined />
                                </Button>
                                <Button variant="outlined" onClick={() => addShape("circle")}>
                                    Circle <CircleOutlined />
                                </Button>
                                <Button variant="outlined" onClick={() => addShape("rectangle")}>
                                    Rectangle <RectangleOutlined />
                                </Button>
                            </Box>
                            <Box mt={2} display="flex" gap={2}>
                                <Button variant="outlined" onClick={() => addShape("triangle")}>
                                    Triangle <ChangeHistoryOutlined />
                                </Button>
                                <Button variant="outlined" onClick={() => addShape("polygon")}>
                                    Polygon <HexagonOutlined />
                                </Button>
                                <Button variant="outlined" onClick={() => adjustZIndex("forward")}>
                                    Forward <LayersOutlined />
                                </Button>
                            </Box>
                            <Box mt={2} display="flex" gap={2}>
                                <Button variant="outlined" onClick={() => adjustZIndex("backward")}>
                                    Backward <Typography><RiBringToFront /></Typography>
                                </Button>
                                <Button variant="outlined" color="error" onClick={deleteObject}>
                                    Delete <DeleteOutlineOutlined />
                                </Button>
                                <Button variant="outlined" color="secondary" onClick={clearCanvas}>
                                    Clear <ClearAllOutlined />
                                </Button>
                            </Box>
                        </Box>
                        <Box>
                            <Button variant="contained" color="success" onClick={downloadCanvas}>
                                Download Image
                            </Button>
                        </Box>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}

export default CanvasPage;
