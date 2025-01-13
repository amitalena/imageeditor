import {
    ChangeHistoryOutlined,
    CircleOutlined,
    ClearAllOutlined,
    DeleteOutlineOutlined,
    HexagonOutlined,
    LayersOutlined,
    RectangleOutlined,
    TitleOutlined,
} from "@mui/icons-material";
import { Button, Stack, Grid, Box, Typography } from "@mui/material";
import * as fabric from "fabric";
import { useEffect, useRef, useCallback } from "react";
import { RiBringToFront } from "react-icons/ri";
import { useParams } from "react-router-dom";

function CanvasPage(): JSX.Element {
    const { imageurl } = useParams<{ imageurl: string }>();
    const canvasRef = useRef<fabric.Canvas | null>(null);

    useEffect(() => {
        const canvas = new fabric.Canvas("canvas", {
            backgroundColor: "#fff",
        });
        canvasRef.current = canvas;
        if (imageurl) {
            fabric.Image.fromURL(imageurl, (img: fabric.Image | null) => {
                if (img instanceof fabric.Image) {
                    // Safely access the 'filters' property
                    img.filters = img.filters || [];
                    img.filters.push(new fabric.Image.filters.Grayscale());
                    img.applyFilters();
                    canvas.add(img);
                }
            });
        }
        return () => {
            canvas.dispose();
        };
    }, [imageurl]);

    const addObject = useCallback((object: fabric.Object) => {
        canvasRef.current?.add(object);
    }, []);

    const addText = useCallback(() => {
        const text = new fabric.Textbox("Edit me", {
            left: 50,
            top: 50,
            fontSize: 20,
            fill: '#d33',
            editable: true,
            width: 150,
        });
        addObject(text);
    }, [addObject]);


    const addShape = useCallback(
        (type: "circle" | "rectangle" | "triangle" | "polygon") => {
            const shapes: Record<string, fabric.Object> = {
                circle: new fabric.Circle({
                    radius: 50,
                    fill: '#1ef',
                    left: 100,
                    top: 100,
                }),
                rectangle: new fabric.Rect({
                    width: 100,
                    height: 50,
                    fill: '#ec5',
                    left: 150,
                    top: 150,
                }),
                triangle: new fabric.Triangle({
                    width: 100,
                    height: 100,
                    fill: '#1e5',
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
                        fill: '#cf3',
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
        }
    }, []);

    const clearCanvas = useCallback(() => {
        canvasRef.current?.clear();
    }, []);

    const adjustZIndex = useCallback((direction: "forward" | "backward") => {
        const canvas = canvasRef.current;
        const activeObject = canvas?.getActiveObject();
        if (canvas && activeObject) {
            if (direction === "forward") {
                (canvas as fabric.Canvas).bringObjectForward(activeObject);
            } else {
                (canvas as fabric.Canvas).sendObjectBackwards(activeObject);
            }
        }
    }, []);

    const downloadCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const dataURL = canvas.toDataURL({ format: "png", quality: 1, multiplier: 1 });
            const link = document.createElement("a");
            link.href = dataURL;
            link.download = "canvas-image.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); // Cleanup
        }
    }, []);

    return (
        <Box sx={{ height: "100vh", width: "100%", p: 2 }}>
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
