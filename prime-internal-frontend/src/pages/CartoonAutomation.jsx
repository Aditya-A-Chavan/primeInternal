import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import { ExpandMore, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';

const CartoonAutomation = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleProcessFiles = async (files) => {
    setIsProcessing(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('pdfs', file);
      });

      const response = await fetch('http://127.0.0.1:9699/processFiles', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log
      setResults(data);
    } catch (err) {
      setError(err.message || 'An error occurred while processing files');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Back to Tools
        </Button>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="600">
          Cartoon Automation
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload PDF files to extract product information and generate cartoon calculations
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!results && (
        <FileUpload onProcessFiles={handleProcessFiles} isProcessing={isProcessing} />
      )}

      {results && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight="600">
              Processing Results
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setResults(null);
                setError(null);
              }}
            >
              Process New Files
            </Button>
          </Box>

          {/* Display Total Cartoon Count */}
          {results.totalCartoon !== undefined && (
            <Box sx={{ mb: 3, p: 3, bgcolor: 'primary.light', borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="primary.contrastText" fontWeight="600">
                Total Cartoons Required: {results.totalCartoon}
              </Typography>
            </Box>
          )}

          {/* Display Not Found Products */}
          {results.notFound && results.notFound.length > 0 && (
            <Box sx={{ mb: 3, p: 3, bgcolor: 'warning.light', borderRadius: 2 }}>
              <Typography variant="h6" color="warning.contrastText" fontWeight="600" sx={{ mb: 2 }}>
                ⚠️ Products with Missing Box Information ({results.notFound.length} items)
              </Typography>
              <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Barcode</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Product Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>MRP</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>QTY</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Source File</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.notFound.map((product, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{product['Barcode'] || '-'}</TableCell>
                        <TableCell>{product['Product Name'] || '-'}</TableCell>
                        <TableCell>{product['MRP'] || '-'}</TableCell>
                        <TableCell>{product['QTY'] || '-'}</TableCell>
                        <TableCell sx={{ maxWidth: 200, wordBreak: 'break-word' }}>
                          {product['Source File'] || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Display Grouped Results */}
          {results.grouped && Object.entries(results.grouped).map(([sourceFile, products]) => (
            <Accordion key={sourceFile} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6" fontWeight="500">
                  {sourceFile}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  ({products.length} products)
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Barcode</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Product Name</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>MRP</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>QTY</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Boxes Required</TableCell>
                      </TableRow>
                    </TableHead>
                                         <TableBody>
                       {products.map((product, index) => (
                         <TableRow key={index} hover>
                           <TableCell>{product['Barcode'] || '-'}</TableCell>
                           <TableCell>{product['Product Name'] || '-'}</TableCell>
                           <TableCell>{product['MRP'] || '-'}</TableCell>
                           <TableCell>{product['QTY'] || '-'}</TableCell>
                           <TableCell>{product['Boxes Required'] || '-'}</TableCell>
                         </TableRow>
                       ))}
                     </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          ))}

          {/* Fallback for old structure if needed */}
          {!results.grouped && Object.entries(results).map(([sourceFile, products]) => (
            <Accordion key={sourceFile} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6" fontWeight="500">
                  {sourceFile}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  ({products.length} products)
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Barcode</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Product Name</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>MRP</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>QTY</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Boxes Required</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.map((product, index) => (
                        <TableRow key={index} hover>
                          <TableCell>{product['Barcode'] || '-'}</TableCell>
                          <TableCell>{product['Product Name'] || '-'}</TableCell>
                          <TableCell>{product['MRP'] || '-'}</TableCell>
                          <TableCell>{product['QTY'] || '-'}</TableCell>
                          <TableCell>{product['Boxes Required'] || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default CartoonAutomation;
