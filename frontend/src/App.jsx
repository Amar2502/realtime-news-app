import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import TechNewsFeed from "./components/TechNewsFeed";
import BusinessNewsFeed from "./components/BusinessNewsFeed";
import HealthNewsFeed from "./components/HealthNewsFeed";
import ScienceNewsFeed from "./components/ScienceNewsfeed";
import EntertainmentNewsFeed from "./components/EntertainmentNewsFeed";
import SportsNewsFeed from "./components/SportsNewsFeed";
import CreateNews from "./components/CreateNews";
import NewsDetail from "./components/NewsDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tech" element={<TechNewsFeed />} />
        <Route path="/business" element={<BusinessNewsFeed />} />
        <Route path="/health" element={<HealthNewsFeed />} />
        <Route path="/science" element={<ScienceNewsFeed />} />
        <Route path="/entertainment" element={<EntertainmentNewsFeed />} />
        <Route path="/sports" element={<SportsNewsFeed />} />
        <Route path="/create-news" element={<CreateNews />} />
        <Route path="/news/:id" element={<NewsDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
