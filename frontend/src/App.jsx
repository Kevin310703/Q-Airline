import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Navbar from './components/navbar/navbar';
import Home from './components/home/home';
import Search from './components/search/search';
import Support from './components/support/support';
import Info from './components/info/info';
import Lounge from './components/lounge/lounge';
import Travelers from './components/travelers/travelers';
import Subscribe from './components/subscribers/subscribe';
import Footer from './components/footer/footer';
import SignIn from './components/auth/signin/signin';
import SignUp from './components/auth/signup/signup';
import AboutPage from './components/pages/about-us/about-us';

import { AuthContext } from './components/context/AuthContext';
import FlightsList from './components/pages/flight/flight-list';
import AirplaneDetails from './components/pages/airplane/airplane-detail';
import Destinations from './components/pages/destination/destination';
import SearchResults from './components/search/search-result';
import TicketList from './components/pages/ticket/ticket-list';
import BookTicket from './components/pages/book-ticket/booking-ticket';
import VerifyEmail from './components/auth/verify-email/verify-email';
import ForgotPassword from './components/auth/forgot-password/forgot-password';
import ResetPassword from './components/auth/forgot-password/reset-password';
import Profile from './components/auth/profile/profile';
import Offers from './components/pages/offer/offer';
import Seats from './components/pages/seat/seat';
import EditProfile from './components/auth/profile/edit-profile';
import NewBookTicket from './components/pages/book-ticket/new-booking-ticket-custom';
import MyTickets from './components/auth/tickets/my-tickets';

const App = () => {
  const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    if (!user) {
      return <Navigate to="/signin" />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Route home page */}
        <Route
          path="/"
          element={
            <div>
              <Navbar />
              <Home />
              <Search />
              <Support />
              <Info />
              <Lounge />
              <Travelers />
              <Subscribe />
              <Footer />
            </div>
          }
        />

        <Route
          path="/about-us"
          element={
            <>
              <Navbar />
              <AboutPage />
              <Footer />
            </>
          }
        />

        <Route
          path="/seats"
          element={
            <>
              <Navbar />
              <Seats />
              <Footer />
            </>
          }
        />

        <Route
          path="/offers"
          element={
            <>
              <Navbar />
              <Offers />
              <Footer />
            </>
          }
        />

        <Route
          path="/destinations"
          element={
            <>
              <Navbar />
              <Destinations />
              <Footer />
            </>
          }
        />

        <Route
          path="/signin"
          element={
            <>
              <Navbar />
              <SignIn />
              <Footer />
            </>
          }
        />

        <Route
          path="/signup"
          element={
            <>
              <Navbar />
              <SignUp />
              <Footer />
            </>
          }
        />

        <Route
          path="/search-results"
          element={
            <>
              <Navbar />
              <SearchResults />
              <Footer />
            </>
          }
        />

        <Route
          path="/flight-list"
          element={
            <>
              <Navbar />
              <FlightsList />
              <Footer />
            </>
          }
        />

        <Route
          path="/ticket-list"
          element={
            <>
              <Navbar />
              <TicketList />
              <Footer />
            </>
          }
        />

        <Route
          path="/book-ticket/:id"
          element={
            <>
              <Navbar />
              <BookTicket />
              <Footer />
            </>
          }
        />

        <Route
          path="/book-ticket"
          element={
            <>
              <Navbar />
              <NewBookTicket />
              <Footer />
            </>
          }
        />

        <Route
          path="/my-ticket"
          element={
            <>
              <Navbar />
              <MyTickets />
              <Footer />
            </>
          }
        />

        <Route
          path="/verify-email"
          element={
            <>
              <Navbar />
              <VerifyEmail />
              <Footer />
            </>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <>
              <Navbar />
              <ForgotPassword />
              <Footer />
            </>
          }
        />

        <Route
          path="/reset-password"
          element={
            <>
              <Navbar />
              <ResetPassword />
              <Footer />
            </>
          }
        />

        <Route
          path="/profile"
          element={
            <>
              <Navbar />
              <Profile />
              <Footer />
            </>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <>
              <Navbar />
              <EditProfile />
              <Footer />
            </>
          }
        />

        <Route
          path="/airplane-information/:id"
          element={
            <>
              <Navbar />
              <AirplaneDetails />
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
