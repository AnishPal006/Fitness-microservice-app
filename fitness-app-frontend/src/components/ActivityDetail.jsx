import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getActivityById, getActivityRecommendation } from "../services/api";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Alert,
  Grid,
} from "@mui/material";
// Import Icons
import TimerIcon from "@mui/icons-material/Timer";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import InsightsIcon from "@mui/icons-material/Insights";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const DetailItem = ({ icon, primary, secondary }) => (
  <ListItem>
    <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
    <ListItemText primary={primary} secondary={secondary} />
  </ListItem>
);

const InfoSection = ({ title, icon, data }) => (
  <Box sx={{ mb: 3 }}>
    <Typography
      variant="h5"
      gutterBottom
      sx={{ display: "flex", alignItems: "center", color: "primary.main" }}
    >
      {icon}
      {title}
    </Typography>
    <List dense>
      {data.map((item, index) => (
        <ListItem key={index}>
          <ListItemIcon sx={{ minWidth: 32 }}>•</ListItemIcon>
          <ListItemText primary={item} />
        </ListItem>
      ))}
    </List>
  </Box>
);

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const activityRes = await getActivityById(id);
        setActivity(activityRes.data);

        // Try to get recommendation
        try {
          const recRes = await getActivityRecommendation(id);
          setRecommendation(recRes.data);
        } catch (recError) {
          console.warn("Could not fetch recommendation:", recError);
          setRecommendation(null); // Set to null if it fails
        }
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!activity) {
    return (
      <Alert severity="error">
        Could not load activity. Please try again later.
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/activities")}
        sx={{ mb: 2 }}
      >
        Back to Activities
      </Button>

      <Grid container spacing={3}>
        {/* Left Card: Activity Stats */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {activity.type}
              </Typography>
              <List>
                <DetailItem
                  icon={<CalendarTodayIcon />}
                  primary="Date"
                  secondary={new Date(activity.createdAt).toLocaleString()}
                />
                <DetailItem
                  icon={<TimerIcon />}
                  primary="Duration"
                  secondary={`${activity.duration} minutes`}
                />
                <DetailItem
                  icon={<WhatshotIcon />}
                  primary="Calories Burned"
                  secondary={activity.caloriesBurned}
                />
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Card: AI Recommendation */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <InsightsIcon
                  sx={{ fontSize: 40, mr: 1, color: "primary.main" }}
                />
                AI-Powered Analysis
              </Typography>

              {!recommendation ? (
                <Alert severity="info">
                  Your AI recommendation is still processing. Please check back
                  in a few minutes.
                </Alert>
              ) : (
                <Box>
                  <Typography
                    paragraph
                    sx={{ mt: 2, fontStyle: "italic", color: "text.secondary" }}
                  >
                    {recommendation.recommendation}
                  </Typography>
                  <Divider sx={{ my: 2 }} />

                  {recommendation.improvements && (
                    <InfoSection
                      title="Areas for Improvement"
                      icon={<CheckCircleOutlineIcon sx={{ mr: 1 }} />}
                      data={recommendation.improvements}
                    />
                  )}
                  {recommendation.suggestions && (
                    <InfoSection
                      title="Workout Suggestions"
                      icon={<LightbulbOutlinedIcon sx={{ mr: 1 }} />}
                      data={recommendation.suggestions}
                    />
                  )}
                  {recommendation.safety && (
                    <InfoSection
                      title="Safety Guidelines"
                      icon={<WarningAmberIcon sx={{ mr: 1 }} />}
                      data={recommendation.safety}
                    />
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ActivityDetail;
