import React, { useContext, useEffect, useMemo, useState } from 'react'
import { extendTheme, styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { AppContext } from '../../contexts/AppContext'
import { AppIcon } from '../login/CustomIcons';
import { Navigate, useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import { USER } from '../../utils/actionType';
import StatsView from '../admin/StatsView';
import MeetingComponent from '../admin/MeetingComponent';
import AvailableSlotComponent from '../admin/AvailableSlotComponent';
import InvestorComponent from '../admin/InvestorComponent';
import PortfolioCompanyComponent from '../admin/PortfolioComponent';
import SelectionComponent from '../admin/SelectionComponent';
import UserComponent from '../admin/UserComponent';

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Overview',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Actions',
  },
  {
    segment: 'meetings',
    title: 'Meetings',
    icon: <LayersIcon />,
  },
  {
    segment: 'availableslots',
    title: 'Available Slots',
    icon: <LayersIcon />,
  },
  {
    segment: 'selections',
    title: 'Selections',
    icon: <LayersIcon />,
  },
  {
    segment: 'investor',
    title: 'Investors',
    icon: <LayersIcon />,
  },
  {
    segment: 'portfoliocompany',
    title: 'Portfolio Company',
    icon: <LayersIcon />,
  },
  {
    segment: 'users',
    title: 'Users',
    icon: <LayersIcon />,
  }
];

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: false },
  colorSchemeSelector: 'class',
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = useState(initialPath);

  const router = useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

export default function AdminDashboard(props) {
  const { window } = props;
  const { state, dispatch } = useContext(AppContext)
  const router = useDemoRouter('/dashboard');
  const demoWindow = window ? window() : undefined;
  const navigate = useNavigate();
  if (state?.user?.data?.claims?.role !== "ADMIN") {
    return (<>
      <Typography>
        Not Access
      </Typography>
      <Button onClick={() => {
        localStorage.removeItem("web-app-storage")
        dispatch({ type: USER, payload: { data: [], isAuthentication: false } })
        navigate("/login")
      }}>Logout</Button></>)
  }


  const COMPONENTS = {
    dashboard: StatsView,
    availableslots: AvailableSlotComponent,
    meetings: MeetingComponent,
    portfoliocompany:PortfolioCompanyComponent,
    investor:InvestorComponent,
    selections:SelectionComponent,
    users:UserComponent
  };

  const ActiveComponent = COMPONENTS[router.pathname.slice(1)] || <></>;
  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      window={demoWindow}
      branding={{
        logo: <AppIcon />,
        title: '',
      }}
      theme={demoTheme}
    >
      <DashboardLayout
        slots={{
          toolbarActions: () => <><Button onClick={() => {
            localStorage.removeItem("web-app-storage")
            dispatch({ type: USER, payload: { data: [], isAuthentication: false } })
            navigate("/login")
          }}>Logout</Button></>
        }}
      >
        <Container>
          <Box sx={{pt:2}}/>
          <ActiveComponent/>
        </Container>
      </DashboardLayout>
    </AppProvider>
  );
}
