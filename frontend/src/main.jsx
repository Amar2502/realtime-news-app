import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from './App.jsx'
import NewsHomepage from './HomePage.jsx';
import TechNewsFeed from './components/TechNewsFeed.jsx';
import SportsNewsFeed from './components/SportsNewsFeed.jsx';
import ScienceNewsFeed from './components/ScienceNewsfeed.jsx';
import HealthNewsFeed from './components/HealthNewsFeed.jsx';
import EntertainmentNewsFeed from './components/EntertainmentNewsFeed.jsx';
import BusinessNewsFeed from './components/BusinessNewsFeed.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route path="" element={<NewsHomepage />} />
      <Route path="/tech" element={<TechNewsFeed />} />
      <Route path="/sports" element={<SportsNewsFeed />} />
      <Route path="/science" element={<ScienceNewsFeed />} />
      <Route path="/health" element={<HealthNewsFeed />} />
      <Route path="/entertainment" element={<EntertainmentNewsFeed />} />
      <Route path="/business" element={<BusinessNewsFeed />} />
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
