import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AddCircle as AddIcon,
  Assignment as TicketIcon,
  BarChart as StatsIcon,
  Logout as LogoutIcon,
  SupportAgent as SupportIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const drawerWidth = 260;

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    if (!user) return [];
    
    if (user.role === 'Employee') {
      return [
        { text: 'Dashboard', path: '/employee', icon: <DashboardIcon /> },
        { text: 'Submit Request', path: '/submit-request', icon: <AddIcon /> },
        { text: 'My Requests', path: '/my-requests', icon: <TicketIcon /> }
      ];
    } else if (user.role === 'Support') {
      return [
        { text: 'Tickets Board', path: '/support', icon: <SupportIcon /> }
      ];
    } else if (user.role === 'Manager') {
      return [
        { text: 'Workload Overview', path: '/manager', icon: <StatsIcon /> },
        { text: 'Tickets Board', path: '/support', icon: <SupportIcon /> }
      ];
    }
    return [];
  };

  const navLinks = getNavLinks();

  const getRoleColor = (role) => {
    switch (role) {
      case 'Manager': return 'error';
      case 'Support': return 'primary';
      default: return 'success';
    }
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0f172a' }}>
      <Toolbar sx={{ justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 800, letterSpacing: 0.5, color: '#818cf8', display: 'flex', alignItems: 'center', gap: 1 }}>
          <TicketIcon /> HelpDesk <span style={{ color: '#fff', fontSize: '11px', fontWeight: 500, background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>Lite</span>
        </Typography>
      </Toolbar>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Avatar sx={{ width: 60, height: 60, mb: 1, bgcolor: '#4f46e5', fontSize: '24px', fontWeight: 600 }}>
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '100%', textAlign: 'center' }}>
          {user?.name}
        </Typography>
        <Typography variant="caption" sx={{ color: '#94a3b8', mb: 1, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '100%', textAlign: 'center' }}>
          {user?.email}
        </Typography>
        <Chip 
          label={user?.role} 
          size="small" 
          color={getRoleColor(user?.role)} 
          sx={{ fontWeight: 600, fontSize: '11px', px: 1 }}
        />
      </Box>
      <List sx={{ flexGrow: 1, px: 2, py: 3 }}>
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <ListItem key={link.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(link.path);
                  setMobileOpen(false);
                }}
                sx={{
                  borderRadius: '12px',
                  bgcolor: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  color: isActive ? '#818cf8' : '#94a3b8',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.03)',
                    color: '#f8fafc',
                    '& .MuiListItemIcon-root': { color: '#f8fafc' }
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#818cf8' : '#64748b', minWidth: '40px' }}>
                  {link.icon}
                </ListItemIcon>
                <ListItemText primary={link.text} slotProps={{ primary: { sx: { fontWeight: isActive ? 600 : 500 } } }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
      <List sx={{ px: 2, py: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: '12px',
              color: '#f43f5e',
              '&:hover': {
                bgcolor: 'rgba(244, 63, 94, 0.08)'
              }
            }}
          >
            <ListItemIcon sx={{ color: '#f43f5e', minWidth: '40px' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Log Out" slotProps={{ primary: { sx: { fontWeight: 600 } } }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0b0f19' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: 'none',
          zIndex: 1100
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, color: '#f8fafc' }}>
            {location.pathname === '/employee' && 'Employee Dashboard'}
            {location.pathname === '/submit-request' && 'New Support Request'}
            {location.pathname === '/my-requests' && 'My Requests'}
            {location.pathname === '/support' && 'Support Tickets Board'}
            {location.pathname === '/manager' && 'Workload Overview'}
            {location.pathname.startsWith('/requests/') && 'Request Details'}
          </Typography>

          <Box>
            <IconButton onClick={handleMenu} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: '#4f46e5', width: 36, height: 36, fontSize: '14px', fontWeight: 600 }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              slotProps={{
                paper: {
                  sx: {
                    bgcolor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 8px 32px 0 rgba(0,0,0,0.3)',
                    mt: 1.5,
                    minWidth: '150px',
                    color: '#f8fafc'
                  }
                }
              }}
            >
              <MenuItem onClick={handleClose} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' } }}>
                <ListItemIcon sx={{ color: '#94a3b8', minWidth: '30px' }}><PersonIcon fontSize="small" /></ListItemIcon>
                Profile
              </MenuItem>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
              <MenuItem onClick={handleLogout} sx={{ color: '#f43f5e', '&:hover': { bgcolor: 'rgba(244, 63, 94, 0.08)' } }}>
                <ListItemIcon sx={{ color: '#f43f5e', minWidth: '30px' }}><LogoutIcon fontSize="small" /></ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="navigation panels"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid rgba(255,255,255,0.06)' },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid rgba(255,255,255,0.06)' },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          pt: '88px',
          bgcolor: 'transparent'
        }}
      >
        <div className="fade-in">
          {children}
        </div>
      </Box>
    </Box>
  );
};

export default Layout;
