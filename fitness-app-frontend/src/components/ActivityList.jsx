import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getActivities } from "../services/api";

// Import Icons
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import PoolIcon from "@mui/icons-material/Pool";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import PendingIcon from "@mui/icons-material/Pending";

const getActivityIcon = (type) => {
  switch (type) {
    case "RUNNING":
      return <DirectionsRunIcon color="primary" />;
    case "WALKING":
      return <DirectionsWalkIcon color="primary" />;
    case "CYCLING":
      return <DirectionsBikeIcon color="primary" />;
    case "SWIMMING":
      return <PoolIcon color="primary" />;
    case "WEIGHT_TRAINING":
      return <FitnessCenterIcon color="primary" />;
    case "YOGA":
      return <SelfImprovementIcon color="primary" />;
    default:
      return <PendingIcon color="primary" />;
  }
};

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await getActivities();
      // Sort activities to show the newest first
      setActivities(
        response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" color="primary" gutterBottom>
        My Activities
      </Typography>
      {activities.length === 0 ? (
        <Typography color="textSecondary">
          You haven't logged any activities yet. Add one to get started!
        </Typography>
      ) : (
        <List>
          {activities.map((activity) => (
            <ListItem
              key={activity.id}
              disablePadding
              divider
              sx={{ borderRadius: 1, mb: 1 }}
            >
              <ListItemButton
                onClick={() => navigate(`/activities/${activity.id}`)}
                sx={{ borderRadius: 1 }}
              >
                <ListItemIcon>{getActivityIcon(activity.type)}</ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="h6">{activity.type}</Typography>
                  }
                  secondary={`Duration: ${activity.duration} min | Calories: ${activity.caloriesBurned} kcal`}
                />
                <Typography variant="body2" color="textSecondary">
                  {new Date(activity.createdAt).toLocaleDateString()}
                </Typography>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ActivityList;
