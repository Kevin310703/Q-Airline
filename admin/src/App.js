import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  announcementInputs,
  planeInputs,
  seatInputs,
  userInputs,
  flightInputs,
  airportInputs,
  ticketInputs,
  promotionInputs,
  destinationInputs,
} from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext";
import {
  planeColumns,
  flightColumns,
  ticketColumns,
  userColumns,
  airportColumns,
  bookingColumns,
  announcementsColumns,
  promotionColumns,
  destinationColumns
} from "./datatablesource";
import Account from "./pages/account/Account";
import NewNotify from "./pages/newNotify/NewNotify";
import Edit from "./pages/edit/Edit";
import NewPlane from "./pages/newPlane/NewPlane";
import SeatDetails from "./pages/seat/SeatDetails";
import NewSeat from "./pages/newSeat/NewSeat";
import NewFlight from "./pages/newFlight/NewFlight";
import NewAirport from "./pages/newAirport/NewAirport";
import NewTicket from "./pages/newTicket/NewTicket";
import NewPromotion from "./pages/newPromotion/newPromotion";
import NewDestination from "./pages/newDestination/newDestination";


function App() {
  const { darkMode } = useContext(DarkModeContext);

  const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path="login" element={<Login />} />
            <Route
              index
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route path="users">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={userColumns} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":userId"
                element={
                  <ProtectedRoute>
                    <Single />
                  </ProtectedRoute>
                }
              />
              <Route
                path="edit/:userId"
                element={
                  <ProtectedRoute>
                    <Edit inputs={userInputs} title="Edit User" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <New inputs={userInputs} title="Add New User" />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="airplanes">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={planeColumns} />
                  </ProtectedRoute>
                }
              />

              <Route
                path=":airplanesId"
                element={
                  <ProtectedRoute>
                    <Single />
                  </ProtectedRoute>
                }
              />

              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewPlane />
                  </ProtectedRoute>
                }
              />

              <Route
                path="edit/:airplanesId"
                element={
                  <ProtectedRoute>
                    <Edit inputs={planeInputs} title="Edit Airplane" />
                  </ProtectedRoute>
                }
              />

              <Route
                path=":airplanesId/seat/:seatId"
                element={
                  <ProtectedRoute>
                    <SeatDetails inputs={seatInputs} />
                  </ProtectedRoute>
                }
              />

              <Route
                path=":airplanesId/seat/new"
                element={
                  <ProtectedRoute>
                    <NewSeat inputs={seatInputs} />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="airplane-flights">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={flightColumns} />
                  </ProtectedRoute>
                }
              />

              <Route
                path=":flightId"
                element={
                  <ProtectedRoute>
                    <Single />
                  </ProtectedRoute>
                }
              />

              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewFlight inputs={flightInputs} title="Add New Flight" />
                  </ProtectedRoute>
                }
              />

              <Route
                path="edit/:id"
                element={
                  <ProtectedRoute>
                    <Edit inputs={flightInputs} title="Edit Flight" />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="airports">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={airportColumns} />
                  </ProtectedRoute>
                }
              />

              <Route
                path=":id"
                element={
                  <ProtectedRoute>
                    <Single />
                  </ProtectedRoute>
                }
              />

              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewAirport inputs={airportInputs} title="Add New Airport" />
                  </ProtectedRoute>
                }
              />

              <Route
                path="edit/:id"
                element={
                  <ProtectedRoute>
                    <Edit inputs={airportInputs} title="Edit Airport" />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="tickets">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={ticketColumns} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewTicket inputs={ticketInputs} title="Add New Ticket" />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="booking-tickets">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={bookingColumns} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewTicket inputs={ticketInputs} title="Add New Ticket" />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="account">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>

          <Route path="promotions">
            <Route
              index
              element={
                <ProtectedRoute>
                  <List columns={promotionColumns} />
                </ProtectedRoute>
              }
            />

            <Route
              path="edit/:promotionId"
              element={
                <ProtectedRoute>
                  <Edit inputs={promotionInputs} title="Edit Promotions" />
                </ProtectedRoute>
              }
            />

            <Route
              path="new"
              element={
                <ProtectedRoute>
                  <NewPromotion inputs={promotionInputs} title="Add New Promotions" />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="destinations">
            <Route
              index
              element={
                <ProtectedRoute>
                  <List columns={destinationColumns} />
                </ProtectedRoute>
              }
            />

            <Route
              path="edit/:destinationId"
              element={
                <ProtectedRoute>
                  <Edit inputs={destinationInputs} title="Edit Destination" />
                </ProtectedRoute>
              }
            />

            <Route
              path="new"
              element={
                <ProtectedRoute>
                  <NewDestination inputs={destinationInputs} title="Add New Destination" />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="announcements">
            <Route
              index
              element={
                <ProtectedRoute>
                  <List columns={announcementsColumns} />
                </ProtectedRoute>
              }
            />
            <Route
              path="edit/:notificationId"
              element={
                <ProtectedRoute>
                  <Edit inputs={announcementInputs} title="Edit Announcement" />
                </ProtectedRoute>
              }
            />

            <Route
              path="new"
              element={
                <ProtectedRoute>
                  <NewNotify inputs={announcementInputs} title="Add New Announcemens" />
                </ProtectedRoute>
              }
            />

          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
