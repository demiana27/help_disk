import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ticketService from '../services/ticketService';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  AddCircle as AddIcon,
  ListAlt as ListIcon,
  OpenInNew as LaunchIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { StatusBadge, PriorityBadge } from '../components/Badges';

const EmployeeDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await ticketService.getTickets();
        setTickets(data);
      } catch (err) {
        console.error('Error fetching employee tickets:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const totalTickets = tickets.length;
  const activeTickets = tickets.filter(t => t.status !== 'Closed').length;
  const closedTickets = tickets.filter(t => t.status === 'Closed').length;

  const recentTickets = tickets.slice(0, 3);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Welcome banner */}
      <Card
        className="glass-card"
        sx={{
          mb: 4,
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(30, 41, 59, 0.4) 100%) !important',
          p: 2
        }}
      >
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc', mb: 1 }}>
            Welcome back, {user?.name}! 👋
          </Typography>
          <Typography variant="body1" sx={{ color: '#94a3b8', maxWidth: '600px', mb: 3 }}>
            Need support? Submit a ticketing request below and our team will get on it. You can also view and track your existing request progress here.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              component={Link}
              to="/submit-request"
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ px: 3, py: 1.2 }}
            >
              Submit Support Request
            </Button>
            <Button
              component={Link}
              to="/my-requests"
              variant="outlined"
              startIcon={<ListIcon />}
              sx={{
                borderColor: 'rgba(255,255,255,0.15)',
                color: '#f8fafc',
                '&:hover': {
                  borderColor: '#818cf8',
                  bgcolor: 'rgba(129, 140, 248, 0.05)'
                }
              }}
            >
              View My Requests
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card className="glass-card" sx={{ p: 1 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                Total Tickets Submitted
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, color: '#f8fafc' }}>
                {totalTickets}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card className="glass-card" sx={{ p: 1 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: '#fb923c', fontWeight: 600 }}>
                Active Requests
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, color: '#fb923c' }}>
                {activeTickets}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card className="glass-card" sx={{ p: 1 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: '#4ade80', fontWeight: 600 }}>
                Closed Requests
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, color: '#4ade80' }}>
                {closedTickets}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Tickets Table */}
      <Card className="glass-card" sx={{ mb: 2 }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc' }}>
            Recent Requests
          </Typography>
          {totalTickets > 3 && (
            <Button
              component={Link}
              to="/my-requests"
              endIcon={<ArrowForwardIcon />}
              sx={{ color: '#818cf8', fontWeight: 600 }}
            >
              See all
            </Button>
          )}
        </Box>
        {recentTickets.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: '#64748b', mb: 2 }}>
              You haven't submitted any support requests yet.
            </Typography>
            <Button
              component={Link}
              to="/submit-request"
              variant="contained"
              startIcon={<AddIcon />}
            >
              Create your first request
            </Button>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
            <Table>
              <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                <TableRow>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Request ID</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Subject</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Category</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Priority</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Status</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Date Submitted</TableCell>
                  <TableCell align="right" sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentTickets.map((ticket) => (
                  <TableRow
                    key={ticket._id}
                    sx={{
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.01)' },
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <TableCell sx={{ color: '#818cf8', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      {ticket.requestId}
                    </TableCell>
                    <TableCell sx={{ color: '#f8fafc', fontWeight: 500, borderBottom: '1px solid rgba(255,255,255,0.04)', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ticket.subject}
                    </TableCell>
                    <TableCell sx={{ color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      {ticket.category}
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <PriorityBadge priority={ticket.priority} />
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <StatusBadge status={ticket.status} />
                    </TableCell>
                    <TableCell sx={{ color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      {new Date(ticket.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <IconButton
                        component={Link}
                        to={`/requests/${ticket._id}`}
                        sx={{ color: '#818cf8', '&:hover': { bgcolor: 'rgba(129, 140, 248, 0.1)' } }}
                      >
                        <LaunchIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </Box>
  );
};

export default EmployeeDashboard;
