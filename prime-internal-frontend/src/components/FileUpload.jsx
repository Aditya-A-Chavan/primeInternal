import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CloudUpload, Delete, Description } from '@mui/icons-material';

const FileUpload = ({ onProcessFiles, isProcessing }) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter(
        file => file.type === 'application/pdf'
      );
      setFiles(prev => [...prev, ...droppedFiles]);
    }
  }, []);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(
      file => file.type === 'application/pdf'
    );
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcessFiles = () => {
    if (files.length > 0) {
      onProcessFiles(files);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
      <Paper
        sx={{
          p: 4,
          border: '2px dashed',
          borderColor: dragActive ? 'primary.main' : 'grey.300',
          borderRadius: 3,
          backgroundColor: dragActive ? 'primary.50' : 'background.paper',
          transition: 'all 0.3s ease',
          textAlign: 'center',
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Upload PDF Files
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Drag and drop PDF files here, or click to select files
        </Typography>
        
        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button
            variant="outlined"
            component="span"
            sx={{ mb: 2 }}
          >
            Select Files
          </Button>
        </label>
      </Paper>

      {files.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Selected Files ({files.length})
          </Typography>
          <Paper sx={{ maxHeight: 300, overflow: 'auto' }}>
            <List>
              {files.map((file, index) => (
                <ListItem key={index} divider>
                  <Description sx={{ mr: 2, color: 'primary.main' }} />
                  <ListItemText
                    primary={file.name}
                    secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => removeFile(index)}
                      disabled={isProcessing}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleProcessFiles}
              disabled={isProcessing || files.length === 0}
              sx={{ minWidth: 200 }}
            >
              {isProcessing ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Processing...
                </>
              ) : (
                'Process Files'
              )}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
