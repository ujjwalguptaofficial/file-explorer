import { createBrowserRouter, RouteObject, RouterProvider } from "react-router-dom"
import { lazyRoute } from "./lazy_route"

export const routes: RouteObject[] = [
    {
        path: "/",
        element: lazyRoute('items/index')
    },
    {
        path: "/items",
        element: lazyRoute('items/index'),
        // children: [
        //     {
        //         path: "/items/new-item",
        //         element: lazyRoute('items/new_item'),
        //     },
        //     {
        //         path: "/items/new-folder",
        //         element: lazyRoute('items/new_folder'),
        //     }
        // ]
    },
    {
        path: "/items/:folderId",
        element: lazyRoute('items/index'),
        children: [
            {
                path: "/items/:folderId/new-item",
                element: lazyRoute('items/new_item'),
            },
            {
                path: "/items/:folderId/new-folder",
                element: lazyRoute('items/new_folder'),
            }
        ]
    },
    {
        path: "*",
        element: lazyRoute('home')
    },
    {
        path: "/counter",
        element: lazyRoute('counter')
    }
];

export const AppRoutes = () => {
    const router = createBrowserRouter(routes);
    return <RouterProvider router={router} />;
};


