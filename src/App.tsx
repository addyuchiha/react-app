import { Router } from "lucide-react";
import HomePage from "./pages/HomePage";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

const router = createBrowserRouter([{
    path: '/',
    element: <HomePage />
},
{
    path: '/login',
    element: <Login />
},
{
    path: '/sign-up',
    element: <SignUp />
}])

function App() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
