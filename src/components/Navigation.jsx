import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import {
    Home as HomeIcon,
    BarChart as StatsIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';

const Navigation = ({ value, onChange }) => {
    return (
        <Paper
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
            }}
            elevation={3}
        >
            <BottomNavigation
                value={value}
                onChange={(event, newValue) => onChange(newValue)}
                showLabels
                sx={{
                    height: 70,
                    '& .MuiBottomNavigationAction-root': {
                        minWidth: 'auto',
                        padding: '6px 12px 8px',
                    },
                    '& .MuiBottomNavigationAction-label': {
                        fontSize: '0.75rem',
                        marginTop: '4px',
                    },
                    '& .Mui-selected': {
                        color: 'primary.main',
                    },
                }}
            >
                <BottomNavigationAction
                    label="Home"
                    icon={<HomeIcon />}
                    value="home"
                />
                <BottomNavigationAction
                    label="Stats"
                    icon={<StatsIcon />}
                    value="stats"
                    disabled
                />
                <BottomNavigationAction
                    label="Settings"
                    icon={<SettingsIcon />}
                    value="settings"
                />
            </BottomNavigation>
        </Paper>
    );
};

export default Navigation;
