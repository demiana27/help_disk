import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ticketService from '../services/ticketService';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogActions,
  FormHelperText
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CloudUpload as UploadIcon,
  CheckCircle as SuccessIcon,
  Description as FileIcon
} from '@mui/icons-material';

const SubmitRequest = () => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [attachment, setAttachment] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [successData, setSuccessData] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('File size must be under 5MB.');
        setAttachment(null);
        return;
      }
      setErrorMsg('');
      setAttachment(file);
    }
  };

  const validate = () => {
    const errors = {};
    if (!subject.trim()) errors.subject = 'Subject is required';
    else if (subject.trim().length < 5) errors.subject = 'Subject must be at least 5 characters';
    
    if (!description.trim()) errors.description = 'Description is required';
    else if (description.trim().length < 15) errors.description = 'Description must be at least 15 characters';
    
    if (!category) errors.category = 'Category is required';
    if (!priority) errors.priority = 'Priority is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setErrorMsg('');
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('subject', subject.trim());
    formData.append('description', description.trim());
    formData.append('category', category);
    formData.append('priority', priority);
    if (attachment) {
      formData.append('attachment', attachment);
    }

    try {
      const result = await ticketService.createTicket(formData);
      setSuccessData(result);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to submit request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: '680px', mx: 'auto' }}>
      <Button
        component={Link}
        to="/employee"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3, color: '#94a3b8', '&:hover': { color: '#f8fafc' } }}
      >
        Back to Dashboard
      </Button>

      <Card className="glass-card" sx={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc', mb: 1 }}>
            Submit Support Request
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 4 }}>
            Please fill in the details of the problem you are experiencing. Support staff will review it shortly.
          </Typography>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
              {errorMsg}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Subject"
                variant="outlined"
                fullWidth
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                error={!!validationErrors.subject}
                helperText={validationErrors.subject}
                InputLabelProps={{ style: { color: '#94a3b8' } }}
                inputProps={{ style: { color: '#f8fafc' } }}
              />

              <TextField
                label="Description"
                variant="outlined"
                multiline
                rows={5}
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={!!validationErrors.description}
                helperText={validationErrors.description}
                InputLabelProps={{ style: { color: '#94a3b8' } }}
                inputProps={{ style: { color: '#f8fafc' } }}
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl fullWidth error={!!validationErrors.category}>
                  <InputLabel id="category-label" style={{ color: '#94a3b8' }}>Category</InputLabel>
                  <Select
                    labelId="category-label"
                    value={category}
                    label="Category"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <MenuItem value="Hardware">Hardware</MenuItem>
                    <MenuItem value="Software">Software</MenuItem>
                    <MenuItem value="Network">Network</MenuItem>
                    <MenuItem value="Access/IAM">Access/IAM</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  {validationErrors.category && (
                    <FormHelperText>{validationErrors.category}</FormHelperText>
                  )}
                </FormControl>

                <FormControl fullWidth error={!!validationErrors.priority}>
                  <InputLabel id="priority-label" style={{ color: '#94a3b8' }}>Priority</InputLabel>
                  <Select
                    labelId="priority-label"
                    value={priority}
                    label="Priority"
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Urgent">Urgent</MenuItem>
                  </Select>
                  {validationErrors.priority && (
                    <FormHelperText>{validationErrors.priority}</FormHelperText>
                  )}
                </FormControl>
              </Stack>

              {/* Upload Attachment */}
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#cbd5e1', mb: 1, fontWeight: 600 }}>
                  Attachments (Optional)
                </Typography>
                <Box
                  sx={{
                    border: '2px dashed rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    p: 3,
                    textAlign: 'center',
                    bgcolor: 'rgba(15, 23, 42, 0.2)',
                    '&:hover': {
                      borderColor: 'rgba(99, 102, 241, 0.5)',
                      bgcolor: 'rgba(15, 23, 42, 0.4)'
                    },
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  component="label"
                >
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                  />
                  <UploadIcon sx={{ color: '#64748b', fontSize: '32px', mb: 1 }} />
                  <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 500 }}>
                    Click to select file
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>
                    PDF, Word Documents, TXT or Images up to 5MB
                  </Typography>
                </Box>
                {attachment && (
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, p: 1.5, bgcolor: 'rgba(99, 102, 241, 0.08)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                    <FileIcon sx={{ color: '#818cf8' }} />
                    <Typography variant="body2" sx={{ color: '#e2e8f0', fontWeight: 500, flexGrow: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {attachment.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      {(attachment.size / 1024).toFixed(1)} KB
                    </Typography>
                  </Box>
                )}
              </Box>

              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 2 }}>
                <Button
                  component={Link}
                  to="/employee"
                  variant="text"
                  sx={{ color: '#94a3b8', '&:hover': { color: '#f8fafc', bgcolor: 'rgba(255,255,255,0.03)' } }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{ px: 4, py: 1 }}
                >
                  {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Request'}
                </Button>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog
        open={Boolean(successData)}
        slotProps={{
          paper: {
            sx: {
              bgcolor: '#1e293b',
              backgroundImage: 'none',
              borderRadius: '20px',
              p: 2,
              border: '1px solid rgba(255,255,255,0.08)',
              maxWidth: '450px',
              textAlign: 'center'
            }
          }
        }}
      >
        <DialogContent sx={{ pb: 1 }}>
          <SuccessIcon sx={{ color: '#4ade80', fontSize: '64px', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc', mb: 1 }}>
            Request Submitted!
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
            Your support request has been successfully recorded under the following tracking ID:
          </Typography>
          <Box
            sx={{
              p: 2,
              bgcolor: 'rgba(74, 222, 128, 0.08)',
              border: '1px dashed rgba(74, 222, 128, 0.3)',
              borderRadius: '12px',
              mb: 3
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#4ade80', letterSpacing: 1 }}>
              {successData?.requestId}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            Subject: <strong style={{ color: '#cbd5e1' }}>{successData?.subject}</strong>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', p: 3, gap: 1 }}>
          <Button
            onClick={() => navigate('/employee')}
            variant="outlined"
            sx={{ borderColor: 'rgba(255,255,255,0.15)', color: '#f8fafc', '&:hover': { borderColor: '#fff' } }}
          >
            Go to Dashboard
          </Button>
          <Button
            onClick={() => navigate(`/requests/${successData?._id}`)}
            variant="contained"
          >
            View Ticket Details
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubmitRequest;
