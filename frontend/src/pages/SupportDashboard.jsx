import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import ticketService from '../services/ticketService';
import { AuthContext } from '../context/AuthContext';
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
  Button,
  TextField,
  InputAdornment,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  OpenInNew as LaunchIcon,
  FilterAltOff as FilterOffIcon,
  AssignmentTurnedIn as AssignIcon
} from '@mui/icons-material';
import { StatusBadge, PriorityBadge } from '../components/Badges';

const SupportDashboard = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState([]);
  
  // Search & Filter states
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [owner, setOwner] = useState('');

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (status) params.status = status;
      if (category) params.category = category;
      if (priority) params.priority = priority;
      if (owner) params.owner = owner;

      const data = await ticketService.getTickets(params);
      setTickets(data);
    } catch (err) {
      console.error('Error fetching support tickets:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const data = await ticketService.getStaffMembers();
      setStaff(data);
    } catch (err) {
      console.error('Error fetching staff list:', err.message);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [status, category, priority, owner]);

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTickets();
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatus('');
    setCategory('');
    setPriority('');
    setOwner('');
    // Fetch all tickets directly
    setTimeout(() => {
      ticketService.getTickets().then(data => setTickets(data));
    }, 50);
  };

  const handleAssignToMe = async (ticketId) => {
    try {
      await ticketService.assignTicket(ticketId, user._id || user.id);
      fetchTickets();
    } catch (err) {
      console.error('Failed to assign ticket to self:', err.message);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc', mb: 1 }}>
        Support Tickets Board
      </Typography>
      <Typography variant="body1" sx={{ color: '#94a3b8', mb: 4 }}>
        Review, search, filter, and assign tickets submitted by employees.
      </Typography>

      {/* Search & Filters Card */}
      <Card className="glass-card" sx={{ mb: 4, p: 3 }}>
        <form onSubmit={handleSearchSubmit}>
          <Grid container spacing={2} alignItems="center">
            {/* Search Bar */}
            <Grid item xs={12} md={4}>
              <TextField
                placeholder="Search Subject, Description, or ID..."
                variant="outlined"
                fullWidth
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* Status */}
            <Grid item xs={6} sm={3} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-label" style={{ color: '#94a3b8' }}>Status</InputLabel>
                <Select
                  labelId="status-label"
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

            {/* Category */}
            <Grid item xs={6} sm={3} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="category-label" style={{ color: '#94a3b8' }}>Category</InputLabel>
                <Select
                  labelId="category-label"
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

            {/* Priority */}
            <Grid item xs={6} sm={3} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="priority-label" style={{ color: '#94a3b8' }}>Priority</InputLabel>
                <Select
                  labelId="priority-label"
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

            {/* Owner */}
            <Grid item xs={6} sm={3} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="owner-label" style={{ color: '#94a3b8' }}>Owner</InputLabel>
                <Select
                  labelId="owner-label"
                  value={owner}
                  label="Owner"
                  onChange={(e) => setOwner(e.target.value)}
                >
                  <MenuItem value="">All Owners</MenuItem>
                  <MenuItem value="unassigned">Unassigned</MenuItem>
                  {staff.map((s) => (
                    <MenuItem key={s._id} value={s._id}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Action buttons */}
            <Grid item xs={12} sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
              {(search || status || category || priority || owner) && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<FilterOffIcon />}
                  onClick={handleClearFilters}
                  sx={{ borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
                >
                  Clear Filters
                </Button>
              )}
              <Button type="submit" variant="contained" size="small">
                Search
              </Button>
            </Grid>
          </Grid>
        </form>
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
              No tickets found matching the search/filter criteria.
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
            <Table>
              <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                <TableRow>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Request ID</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Subject</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Employee</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Category</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Priority</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Status</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Owner</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Submitted</TableCell>
                  <TableCell align="right" sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Actions</TableCell>
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
                    <TableCell sx={{ color: '#f8fafc', fontWeight: 500, borderBottom: '1px solid rgba(255,255,255,0.04)', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ticket.subject}
                    </TableCell>
                    <TableCell sx={{ color: '#e2e8f0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      {ticket.employee?.name || 'Unknown'}
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
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                        {!ticket.owner && ticket.status !== 'Closed' && (
                          <Tooltip title="Assign to Me">
                            <IconButton
                              size="small"
                              onClick={() => handleAssignToMe(ticket._id)}
                              sx={{ color: '#34d399', '&:hover': { bgcolor: 'rgba(52, 211, 153, 0.1)' } }}
                            >
                              <AssignIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="View Request Details">
                          <IconButton
                            component={Link}
                            to={`/requests/${ticket._id}`}
                            sx={{ color: '#818cf8', '&:hover': { bgcolor: 'rgba(129, 140, 248, 0.1)' } }}
                          >
                            <LaunchIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
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

export default SupportDashboard;
