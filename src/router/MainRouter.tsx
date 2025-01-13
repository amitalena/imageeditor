import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import PageNotFound from "../pages/PageNotFound";
import CanvaPage from "../pages/CanvasPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "canvas/:imageurl",
                element: <CanvaPage />,
            },
            {
                path: "*",
                element: <PageNotFound />,
            },
        ],
    },
]);

function MainRouter() {
    return <RouterProvider router={router} />;
}

export default MainRouter;