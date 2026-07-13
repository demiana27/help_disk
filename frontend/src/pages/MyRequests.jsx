import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ticketService from '../services/ticketService';
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@mui/material';
import {
  OpenInNew as LaunchIcon,
  FilterAltOff as FilterOffIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { StatusBadge, PriorityBadge } from '../components/Badges';

const MyRequests = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = {};
      if (status) params.status = status;
      if (category) params.category = category;
      if (priority) params.priority = priority;

      const data = await ticketService.getTickets(params);
      setTickets(data);
    } catch (err) {
      console.error('Error fetching tickets:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [status, category, priority]);

  const handleClearFilters = () => {
    setStatus('');
    setCategory('');
    setPriority('');
  };

  return (
    <Box>
      <Button
        component={Link}
        to="/employee"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3, color: '#94a3b8', '&:hover': { color: '#f8fafc' } }}
      >
        Back to Dashboard
      </Button>

      <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc', mb: 1 }}>
        My Support Requests
      </Typography>
      <Typography variant="body1" sx={{ color: '#94a3b8', mb: 4 }}>
        View and check the status of all support tickets you have submitted.
      </Typography>

      {/* Filter Card */}
      <Card className="glass-card" sx={{ mb: 4, p: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label" style={{ color: '#94a3b8' }}>Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="In Review">In Review</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="category-filter-label" style={{ color: '#94a3b8' }}>Category</InputLabel>
              <Select
                labelId="category-filter-label"
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="Hardware">Hardware</MenuItem>
                <MenuItem value="Software">Software</MenuItem>
                <MenuItem value="Network">Network</MenuItem>
                <MenuItem value="Access/IAM">Access/IAM</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="priority-filter-label" style={{ color: '#94a3b8' }}>Priority</InputLabel>
              <Select
                labelId="priority-filter-label"
                value={priority}
                label="Priority"
                onChange={(e) => setPriority(e.target.value)}
              >
                <MenuItem value="">All Priorities</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            {(status || category || priority) && (
              <Button
                variant="outlined"
                color="error"
                fullWidth
                startIcon={<FilterOffIcon />}
                onClick={handleClearFilters}
                sx={{
                  borderColor: 'rgba(239, 68, 68, 0.2)',
                  color: '#ef4444',
                  '&:hover': {
                    borderColor: '#ef4444',
                    bgcolor: 'rgba(239, 68, 68, 0.05)'
                  }
                }}
              >
                Clear Filters
              </Button>
            )}
          </Grid>
        </Grid>
      </Card>

      {/* Ticket List Table */}
      <Card className="glass-card">
        {loading ? (
          <Box sx={{ p: 8, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress color="primary" />
          </Box>
        ) : tickets.length === 0 ? (
          <Box sx={{ p: 8, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              No requests found matching the filter criteria.
            </Typography>
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
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Assigned Owner</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Date Submitted</TableCell>
                  <TableCell align="right" sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.map((ticket) => (
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
                    <TableCell sx={{ color: '#f8fafc', fontWeight: 500, borderBottom: '1px solid rgba(255,255,255,0.04)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                    <TableCell sx={{ color: ticket.owner ? '#e2e8f0' : '#64748b', fontWeight: ticket.owner ? 500 : 400, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      {ticket.owner ? ticket.owner.name : 'Unassigned'}
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

export default MyRequests;
