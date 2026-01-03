import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AuthLayout from "../layouts/AuthLayout";
import PublicRouter from "../Protected/PublicRouter";
import ProtectedRouter from "../Protected/ProtectedRouter";
import Dashboard from "../pages/Dashboard";
import PublicPortfolio from "../pages/PublicPortfolio";
import PortfolioPreview from "./../pages/PreviewPage";
import NotFound from "../pages/NotFound";

export const router=createBrowserRouter([
    {
        element:<PublicRouter/>,
        children:[
            {
                element:<AuthLayout/>,
                children:[
                    {path:'/',element:<Login/>},
                    {path:'/register',element:<Register/>},
                    
                ]
            }
        ],
    },
    {
        element:<ProtectedRouter/>,
        children:[
            {path:'/dashboard',element:<Dashboard/>},
            {path:'/dashboard/preview',element:<PortfolioPreview/>},
        ]
    },
    {path:'/portfolios/:username',element:<PublicPortfolio/>},
    {path:'*',element:<NotFound/>},
])