import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ToolCard = ({ title, description, route, icon: Icon }) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        minWidth: 300,
        maxWidth: 400,
        height: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        },
      }}
      onClick={() => navigate(route)}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {Icon && <Icon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />}
          <Typography variant="h5" component="h2" fontWeight="600">
            {title}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>
      </CardContent>
      <Box sx={{ p: 3, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Open Tool
        </Button>
      </Box>
    </Card>
  );
};

export default ToolCard;
