import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/login";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";
import Root from "./layouts/Root";
import UsersPage from "./pages/UsersPage/UsersPage";
import RestaurantsPage from "./pages/RestaurantsPage/RestaurantsPage";
import ProductsPage from "./pages/ProductsPage/ProductsPage";
import PromosPage from "./pages/PromosPage/PromosPage";
import OrdersPage from "./pages/OrdersPage/OrdersPage";
import SingleOrderPage from "./pages/OrdersPage/SingleOrderPage";
import ToppingsPage from "./pages/ToppingsPage/ToppingsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <DashboardLayout />,
        children: [
          {
            path: "",
            element: <HomePage />,
          },
          {
            path: "users",
            element: <UsersPage />,
          },
          {
            path: "restaurants",
            element: <RestaurantsPage />,
          },
          {
            path: "products",
            element: <ProductsPage />,
          },
          {
            path: "toppings",
            element: <ToppingsPage />,
          },
          {
            path: "promos",
            element: <PromosPage />,
          },
          {
            path: "orders",
            element: <OrdersPage />,
          },
          {
            path: "orders/:orderId",
            element: <SingleOrderPage />,
          },
        ],
      },
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
