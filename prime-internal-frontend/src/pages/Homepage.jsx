import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';
import ToolCard from '../components/ToolCard';

const Homepage = () => {
  const tools = [
    {
      title: 'Cartoon Automation',
      description: 'Process PDF files to extract product information and generate automated cartoon calculations.',
      route: '/cartoon-automation',
      icon: AutoAwesome,
    },
    // Future tools can be easily added here
    // {
    //   title: 'Another Tool',
    //   description: 'Description for another tool.',
    //   route: '/another-tool',
    //   icon: AnotherIcon,
    // },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="700">
          Prime Internal Tools Suite
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Streamline your workflow with our internal automation tools
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {tools.map((tool, index) => (
          <Grid item key={index}>
            <ToolCard {...tool} />
          </Grid>
        ))}
      </Grid>

      {tools.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No tools available at the moment.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Homepage;
