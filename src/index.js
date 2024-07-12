import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Cookware from './routes/cookware';
import Bakeware from './routes/bakeware';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SearchResults from './components/searchresults';
import Wishlist from './routes/wishlist';
import Register from './routes/registerpage';
import Notification from './components/notification';
import Login from './routes/loginpage';
import UserAccount from './routes/useraccount';
import UserQuotations from './routes/user_quotations';
import UserPurchases from './routes/user_purchases';
import RentalRequest from './routes/rentalform';
import PurchaseForm from './routes/purchaseform';
import Acknowledgement from './routes/acknowledgement';

const router = createBrowserRouter([
  {
    path: '/',
    // home page
    element: <App />,
    children: [
      {
        path: 'cookware',
        element: <Cookware />
      },
      {
        path: 'bakeware',
        element: <Bakeware />
      },
      {
        path: 'searchresults',
        element: <SearchResults />
      },
      {
        path: 'wishlist',
        element: <Wishlist />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'notification',
        element: <Notification />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'account',
        element: <UserAccount />
      },
      {
        path: 'quotes',
        element: <UserQuotations />
      },
      {
        path: 'purchases',
        element: <UserPurchases />
      },
      {
        path: 'rentalform',
        element: <RentalRequest />
      },
      {
        path: 'purchaseform',
        element: <PurchaseForm />
      },
      {
        path: 'acknowledgement',
        element: <Acknowledgement />
      }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
