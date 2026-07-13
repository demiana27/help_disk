import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ticketService from '../services/ticketService';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import {
  OpenInNew as LaunchIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { StatusBadge } from '../components/Badges';

const ManagerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [openTickets, setOpenTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const statsData = await ticketService.getTicketStats();
      setStats(statsData);

      const ticketsData = await ticketService.getTickets();
      const open = ticketsData.filter(t => t.status !== 'Closed');
      setOpenTickets(open);
    } catch (err) {
      console.error('Error fetching manager dashboard data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const { statusCounts, unassignedCount, workload } = stats || {
    statusCounts: { Total: 0, New: 0, 'In Progress': 0, 'In Review': 0, Closed: 0 },
    unassignedCount: 0,
    workload: []
  };

  const openTicketsCount = statusCounts.New + statusCounts['In Progress'] + statusCounts['In Review'];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc', mb: 1 }}>
        Manager Workload Dashboard
      </Typography>
      <Typography variant="body1" sx={{ color: '#94a3b8', mb: 4 }}>
        Monitor support agent workloads, open tickets progress, and assignments.
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="glass-card" sx={{ p: 0.5 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                Total Open Tickets
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, color: '#60a5fa' }}>
                {openTicketsCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="glass-card" sx={{ p: 0.5 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: '#f43f5e', fontWeight: 600 }}>
                Unassigned Requests
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, color: '#f43f5e' }}>
                {unassignedCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="glass-card" sx={{ p: 0.5 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: '#fb923c', fontWeight: 600 }}>
                In Progress
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, color: '#fb923c' }}>
                {statusCounts['In Progress']}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="glass-card" sx={{ p: 0.5 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: '#4ade80', fontWeight: 600 }}>
                Resolved Tickets
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, color: '#4ade80' }}>
                {statusCounts.Closed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4} sx={{ mb: 4 }}>
        {/* Support Staff Workload */}
        <Grid item xs={12} lg={5}>
          <Card className="glass-card" sx={{ height: '100%' }}>
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <PeopleIcon sx={{ color: '#818cf8' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                Support Team Workload
              </Typography>
            </Box>
            <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600, py: 1.5 }}>Staff Agent</TableCell>
                    <TableCell align="center" sx={{ color: '#94a3b8', fontWeight: 600, py: 1.5 }}>Active</TableCell>
                    <TableCell align="center" sx={{ color: '#94a3b8', fontWeight: 600, py: 1.5 }}>Closed</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {workload.map((staff) => (
                    <TableRow key={staff._id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.01)' } }}>
                      <TableCell sx={{ py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 600 }}>
                          {staff.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          {staff.email}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <Box sx={{ display: 'inline-block', px: 1.5, py: 0.5, borderRadius: '6px', bgcolor: staff.activeTickets > 2 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(99, 102, 241, 0.1)', color: staff.activeTickets > 2 ? '#f43f5e' : '#818cf8', fontWeight: 700, fontSize: '12px' }}>
                          {staff.activeTickets}
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ color: '#4ade80', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        {staff.closedTickets}
                      </TableCell>
                    </TableRow>
                  ))}
                  {workload.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3, color: '#64748b' }}>
                        No support staff profiles found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* Open Tickets list */}
        <Grid item xs={12} lg={7}>
          <Card className="glass-card" sx={{ height: '100%' }}>
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                Open Requests Monitoring ({openTickets.length})
              </Typography>
              <Button
                component={Link}
                to="/support"
                size="small"
                sx={{ color: '#818cf8', fontWeight: 600 }}
              >
                Go to Ticket Board
              </Button>
            </Box>
            {openTickets.length === 0 ? (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <Typography variant="body1" sx={{ color: '#64748b' }}>
                  All tickets are currently resolved! 🎉
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                    <TableRow>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 600, py: 1.5 }}>ID</TableCell>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 600, py: 1.5 }}>Subject</TableCell>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 600, py: 1.5 }}>Status</TableCell>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 600, py: 1.5 }}>Owner</TableCell>
                      <TableCell align="right" sx={{ color: '#94a3b8', fontWeight: 600, py: 1.5 }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {openTickets.slice(0, 6).map((ticket) => (
                      <TableRow key={ticket._id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.01)' } }}>
                        <TableCell sx={{ color: '#818cf8', fontWeight: 600, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          {ticket.requestId}
                        </TableCell>
                        <TableCell sx={{ color: '#f8fafc', fontWeight: 500, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.04)', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {ticket.subject}
                        </TableCell>
                        <TableCell sx={{ py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <StatusBadge status={ticket.status} />
                        </TableCell>
                        <TableCell sx={{ color: ticket.owner ? '#e2e8f0' : '#f43f5e', fontWeight: ticket.owner ? 500 : 600, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          {ticket.owner ? ticket.owner.name : 'Unassigned'}
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <Tooltip title="View Details">
                            <IconButton
                              component={Link}
                              to={`/requests/${ticket._id}`}
                              size="small"
                              sx={{ color: '#818cf8', '&:hover': { bgcolor: 'rgba(129, 140, 248, 0.1)' } }}
                            >
                              <LaunchIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManagerDashboard;
