import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  Stack
} from '@mui/material';
import { Assignment as TicketIcon } from '@mui/icons-material';

const Login = () => {
  const { login, isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'Employee') navigate('/employee');
      else if (user.role === 'Support') navigate('/support');
      else if (user.role === 'Manager') navigate('/manager');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (roleEmail) => {
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await login(roleEmail, 'Password123');
    } catch (err) {
      setErrorMsg(err.message || 'Quick login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        background: 'radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 100%)'
      }}
    >
      <Card
        className="glass-panel"
        sx={{
          width: '100%',
          maxWidth: '420px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          borderRadius: '24px'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
                mb: 2
              }}
            >
              <TicketIcon sx={{ color: '#fff', fontSize: '28px' }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc', letterSpacing: 0.5 }}>
              HelpDesk <span className="glow-text" style={{ color: '#818cf8' }}>Lite</span>
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5 }}>
              Internal Support Ticketing System
            </Typography>
          </Box>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: '12px', bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              {errorMsg}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Email Address"
                type="email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                InputLabelProps={{ style: { color: '#94a3b8' } }}
                inputProps={{ style: { color: '#f8fafc' } }}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputLabelProps={{ style: { color: '#94a3b8' } }}
                inputProps={{ style: { color: '#f8fafc' } }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
                fullWidth
                sx={{
                  py: 1.5,
                  fontSize: '15px',
                  fontWeight: 700,
                  letterSpacing: 0.3
                }}
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </Stack>
          </form>

          <Box sx={{ my: 3.5, display: 'flex', alignItems: 'center' }}>
            <Divider sx={{ flexGrow: 1, borderColor: 'rgba(255,255,255,0.06)' }} />
            <Typography variant="caption" sx={{ px: 2, color: '#475569', fontWeight: 600 }}>
              DEMO ACCOUNT PRESETS
            </Typography>
            <Divider sx={{ flexGrow: 1, borderColor: 'rgba(255,255,255,0.06)' }} />
          </Box>

          <Stack spacing={1.5}>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={() => handleQuickLogin('employee@helpdesk.com')}
              disabled={isSubmitting}
              sx={{
                borderColor: 'rgba(255,255,255,0.08)',
                color: '#34d399',
                '&:hover': {
                  borderColor: '#34d399',
                  bgcolor: 'rgba(52, 211, 153, 0.05)'
                }
              }}
            >
              Quick Login: Employee
            </Button>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={() => handleQuickLogin('support@helpdesk.com')}
              disabled={isSubmitting}
              sx={{
                borderColor: 'rgba(255,255,255,0.08)',
                color: '#60a5fa',
                '&:hover': {
                  borderColor: '#60a5fa',
                  bgcolor: 'rgba(96, 165, 250, 0.05)'
                }
              }}
            >
              Quick Login: Support Staff
            </Button>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={() => handleQuickLogin('manager@helpdesk.com')}
              disabled={isSubmitting}
              sx={{
                borderColor: 'rgba(255,255,255,0.08)',
                color: '#f87171',
                '&:hover': {
                  borderColor: '#f87171',
                  bgcolor: 'rgba(248, 113, 113, 0.05)'
                }
              }}
            >
              Quick Login: Manager
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
