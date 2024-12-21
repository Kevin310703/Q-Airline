import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

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
import AirplanesList from './components/pages/airplane/airplane-list';
import Contact from './components/pages/contact/contact';
import OnTopButton from './components/opTopButton/OnTopButton';

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
              <OnTopButton />
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
          path="/contact"
          element={
            <>
              <Navbar />
              <Contact />
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
              <OnTopButton />
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
          path="/airplane-list"
          element={
            <>
              <Navbar />
              <AirplanesList />
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
              <ProtectedRoute>
                <Navbar />
                <Profile />
                <Footer />
              </ProtectedRoute>
            </>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <>
              <ProtectedRoute>
                <Navbar />
                <EditProfile />
                <Footer />
              </ProtectedRoute>
            </>
          }
        />

        <Route
          path="/book-ticket/:id"
          element={
            <>
              <ProtectedRoute>
                <Navbar />
                <BookTicket />
                <Footer />
              </ProtectedRoute>
            </>
          }
        />

        <Route
          path="/book-ticket"
          element={
            <>
              <ProtectedRoute>
                <Navbar />
                <NewBookTicket />
                <Footer />
              </ProtectedRoute>
            </>
          }
        />

        <Route
          path="/my-ticket"
          element={
            <>
              <ProtectedRoute>
                <Navbar />
                <MyTickets />
                <Footer />
              </ProtectedRoute>
            </>
          }
        />
      </Routes>
    </Router >
  )
}

export default App
