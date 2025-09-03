# Prime Internal Tools Suite - Frontend

A clean, scalable React application for internal automation tools.

## Features

- **Homepage**: Card-based layout displaying available tools
- **Cartoon Automation**: PDF processing tool with file upload and results display
- **Scalable Architecture**: Easy to add new tools in the future
- **Modern UI**: Material-UI components with professional styling

## Project Structure

```
src/
├── components/
│   ├── ToolCard.jsx          # Reusable card component for tools
│   └── FileUpload.jsx        # File upload with drag & drop
├── pages/
│   ├── Homepage.jsx          # Main dashboard with tool cards
│   └── CartoonAutomation.jsx # PDF processing tool page
├── App.js                    # Main app with routing
└── index.js                  # Entry point
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Adding New Tools

To add a new tool:

1. Create a new page component in `src/pages/`
2. Add the tool to the `tools` array in `Homepage.jsx`
3. Add a new route in `App.js`

## API Integration

The Cartoon Automation tool expects a backend API at `/processFiles` that:
- Accepts POST requests with PDF files
- Returns JSON grouped by source file
- Each group contains an array of products with: barcode, productName, mrp, qty, boxesRequired

## Technologies Used

- React 19
- React Router DOM
- Material-UI (MUI)
- Emotion (for styling)
