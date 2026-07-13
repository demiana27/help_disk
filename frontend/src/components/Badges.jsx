import React from 'react';
import { Chip } from '@mui/material';

export const StatusBadge = ({ status }) => {
  const getColors = () => {
    switch (status) {
      case 'New':
        return { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', border: 'rgba(56, 189, 248, 0.3)' };
      case 'In Progress':
        return { bg: 'rgba(251, 146, 60, 0.15)', text: '#fb923c', border: 'rgba(251, 146, 60, 0.3)' };
      case 'In Review':
        return { bg: 'rgba(192, 132, 252, 0.15)', text: '#c084fc', border: 'rgba(192, 132, 252, 0.3)' };
      case 'Closed':
        return { bg: 'rgba(74, 222, 128, 0.15)', text: '#4ade80', border: 'rgba(74, 222, 128, 0.3)' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.15)', text: '#94a3b8', border: 'rgba(148, 163, 184, 0.3)' };
    }
  };

  const colors = getColors();

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        fontWeight: 600,
        fontSize: '11px',
        borderRadius: '6px'
      }}
    />
  );
};

export const PriorityBadge = ({ priority }) => {
  const getColors = () => {
    switch (priority) {
      case 'Low':
        return { bg: 'rgba(148, 163, 184, 0.1)', text: '#94a3b8', border: 'rgba(148, 163, 184, 0.2)' };
      case 'Medium':
        return { bg: 'rgba(96, 165, 250, 0.15)', text: '#60a5fa', border: 'rgba(96, 165, 250, 0.3)' };
      case 'High':
        return { bg: 'rgba(251, 146, 60, 0.15)', text: '#fb923c', border: 'rgba(251, 146, 60, 0.3)' };
      case 'Urgent':
        return { bg: 'rgba(244, 63, 94, 0.2)', text: '#f43f5e', border: 'rgba(244, 63, 94, 0.4)' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.1)', text: '#94a3b8', border: 'rgba(148, 163, 184, 0.2)' };
    }
  };

  const colors = getColors();

  return (
    <Chip
      label={priority}
      size="small"
      sx={{
        bgcolor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        fontWeight: 600,
        fontSize: '11px',
        borderRadius: '6px'
      }}
    />
  );
};
