import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ticketService from '../services/ticketService';
import { AuthContext } from '../context/AuthContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Divider,
  Alert,
  Paper,
  Stack
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  AttachFile as AttachFileIcon,
  Download as DownloadIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  PriorityHigh as PriorityIcon,
  CalendarToday as DateIcon,
  AssignmentInd as OwnerIcon
} from '@mui/icons-material';
import { StatusBadge, PriorityBadge } from '../components/Badges';

const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form bindings
  const [selectedOwner, setSelectedOwner] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchTicketDetails = async () => {
    try {
      const data = await ticketService.getTicketById(id);
      setTicket(data);
      setSelectedOwner(data.owner?._id || '');
      setSelectedStatus(data.status || '');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to load ticket details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffMembers = async () => {
    if (user.role === 'Support' || user.role === 'Manager') {
      try {
        const staffData = await ticketService.getStaffMembers();
        setStaff(staffData);
      } catch (err) {
        console.error('Failed to load support team members:', err.message);
      }
    }
  };

  useEffect(() => {
    fetchTicketDetails();
    fetchStaffMembers();
  }, [id]);

  const handleAssignOwner = async (ownerId) => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsUpdating(true);
    try {
      const updatedTicket = await ticketService.assignTicket(id, ownerId);
      setTicket(updatedTicket);
      setSelectedOwner(ownerId);
      setSelectedStatus(updatedTicket.status); // Might advance New to In Progress
      setSuccessMsg('Ticket owner updated successfully.');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update owner.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsUpdating(true);
    try {
      const updatedTicket = await ticketService.updateTicketStatus(id, status);
      setTicket(updatedTicket);
      setSelectedStatus(status);
      setSuccessMsg('Ticket status updated successfully.');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBack = () => {
    if (user.role === 'Employee') navigate('/employee');
    else if (user.role === 'Support') navigate('/support');
    else if (user.role === 'Manager') navigate('/manager');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (errorMsg && !ticket) {
    return (
      <Box sx={{ maxWidth: '800px', mx: 'auto', mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>{errorMsg}</Alert>
        <Button onClick={handleBack} startIcon={<ArrowBackIcon />} variant="contained">
          Back
        </Button>
      </Box>
    );
  }

  // File download target
  const fileDownloadUrl = ticket.attachmentPath
    ? `${import.meta.env.VITE_API_URL.replace('/api', '')}/${ticket.attachmentPath}`
    : null;

  return (
    <Box sx={{ maxWidth: '900px', mx: 'auto' }}>
      <Button
        onClick={handleBack}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3, color: '#94a3b8', '&:hover': { color: '#f8fafc' } }}
      >
        Back to Dashboard
      </Button>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }} onClose={() => setSuccessMsg('')}>
          {successMsg}
        </Alert>
      )}

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }} onClose={() => setErrorMsg('')}>
          {errorMsg}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Main description section */}
        <Grid item xs={12} md={8}>
          <Card className="glass-card" sx={{ p: 1, mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                  {ticket.subject}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#818cf8', fontWeight: 700 }}>
                  {ticket.requestId}
                </Typography>
              </Box>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', my: 2 }} />

              <Typography variant="subtitle2" sx={{ color: '#94a3b8', mb: 1, fontWeight: 700 }}>
                DESCRIPTION
              </Typography>
              <Paper
                sx={{
                  p: 2.5,
                  bgcolor: 'rgba(15, 23, 42, 0.25)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '12px',
                  color: '#e2e8f0',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6,
                  mb: 3
                }}
              >
                {ticket.description}
              </Paper>

              {ticket.attachmentPath && (
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#94a3b8', mb: 1, fontWeight: 700 }}>
                    ATTACHMENT
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      bgcolor: 'rgba(99, 102, 241, 0.04)',
                      border: '1px solid rgba(99, 102, 241, 0.15)',
                      borderRadius: '12px'
                    }}
                  >
                    <AttachFileIcon sx={{ color: '#818cf8' }} />
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ticket.attachmentName || 'attachment'}
                      </Typography>
                    </Box>
                    <Button
                      href={fileDownloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outlined"
                      size="small"
                      startIcon={<DownloadIcon />}
                      sx={{
                        borderColor: 'rgba(99, 102, 241, 0.3)',
                        color: '#818cf8',
                        '&:hover': {
                          borderColor: '#818cf8',
                          bgcolor: 'rgba(129, 140, 248, 0.05)'
                        }
                      }}
                    >
                      Download
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Info panel */}
        <Grid item xs={12} md={4}>
          <Card className="glass-card" sx={{ p: 0.5, mb: 4 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc', mb: 2 }}>
                Metadata
              </Typography>
              <Stack spacing={2.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <PersonIcon sx={{ color: '#64748b' }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Created By
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 600 }}>
                      {ticket.employee?.name}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CategoryIcon sx={{ color: '#64748b' }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Category
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 600 }}>
                      {ticket.category}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <PriorityIcon sx={{ color: '#64748b' }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Priority
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <PriorityBadge priority={ticket.priority} />
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <DateIcon sx={{ color: '#64748b' }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Submitted On
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 600 }}>
                      {new Date(ticket.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <OwnerIcon sx={{ color: '#64748b' }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Assigned Owner
                    </Typography>
                    <Typography variant="body2" sx={{ color: ticket.owner ? '#f8fafc' : '#94a3b8', fontWeight: 600 }}>
                      {ticket.owner ? ticket.owner.name : 'Unassigned'}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 24 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      Current Status
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <StatusBadge status={ticket.status} />
                    </Box>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Action box */}
          {(user.role === 'Support' || user.role === 'Manager') && (
            <Card className="glass-card" sx={{ p: 0.5 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc', mb: 2.5 }}>
                  Actions
                </Typography>
                <Stack spacing={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="assign-owner-select" style={{ color: '#94a3b8' }}>Assign Ticket Owner</InputLabel>
                    <Select
                      labelId="assign-owner-select"
                      value={selectedOwner}
                      label="Assign Ticket Owner"
                      disabled={isUpdating}
                      onChange={(e) => handleAssignOwner(e.target.value)}
                    >
                      <MenuItem value="">Unassigned</MenuItem>
                      {staff.map((s) => (
                        <MenuItem key={s._id} value={s._id}>
                          {s.name} ({s.role})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <InputLabel id="update-status-select" style={{ color: '#94a3b8' }}>Update Status</InputLabel>
                    <Select
                      labelId="update-status-select"
                      value={selectedStatus}
                      label="Update Status"
                      disabled={isUpdating}
                      onChange={(e) => handleUpdateStatus(e.target.value)}
                    >
                      <MenuItem value="New">New</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="In Review">In Review</MenuItem>
                      <MenuItem value="Closed">Closed</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default RequestDetails;
