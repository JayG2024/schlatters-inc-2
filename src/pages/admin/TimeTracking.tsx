import React from 'react';
import TimeTrackingPage from './TimeTracking/index';

// This component now simply wraps the TimeTrackingPage component that handles the routing
const TimeTracking: React.FC = () => {
  return <TimeTrackingPage />;
};

export default TimeTracking;