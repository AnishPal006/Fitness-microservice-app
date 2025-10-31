import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { setCredentials } from "./store/authSlice";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/ActivityDetail";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

const ActivitiesPage = () => {
  const [refreshKey, setRefreshKey] = useState(0); // Use state to trigger refresh

  const handleActivityAdded = () => {
    setRefreshKey((oldKey) => oldKey + 1); // Increment key to re-fetch list
  };

  return (
    <Grid container spacing={3}>
      {/* Form on the left */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <ActivityForm onActivityAdded={handleActivityAdded} />
        </Paper>
      </Grid>
      {/* List on the right */}
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <ActivityList key={refreshKey} /> {/* Pass key to force re-render */}
        </Paper>
      </Grid>
    </Grid>
  );
};

function App() {
  const { token, tokenData, logIn, logOut } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({ token, user: tokenData }));
      setAuthReady(true);
    }
  }, [token, tokenData, dispatch]);

  return (
    <Router>
      {!token ? (
        // --- New Login Screen ---
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 2,
            }}
          >
            <FitnessCenterIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
            <Typography component="h1" variant="h5" gutterBottom>
              Fitness Tracker
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              sx={{ mb: 3 }}
            >
              Log in to track your fitness and get AI-powered insights.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={() => logIn()}
            >
              Login
            </Button>
          </Paper>
        </Container>
      ) : (
        // --- New App Layout ---
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <FitnessCenterIcon sx={{ mr: 2 }} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Fitness Dashboard
              </Typography>
              <Button color="inherit" onClick={logOut}>
                Logout
              </Button>
            </Toolbar>
          </AppBar>
          <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Routes>
              <Route path="/activities" element={<ActivitiesPage />} />
              <Route path="/activities/:id" element={<ActivityDetail />} />
              <Route path="/" element={<Navigate to="/activities" replace />} />
            </Routes>
          </Container>
        </Box>
      )}
    </Router>
  );
}

export default App;
