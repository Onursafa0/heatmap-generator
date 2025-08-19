# 🔥 Heatmap Generator

A modern and interactive heatmap chart generator built with Angular. Users can manually input data and create professional heatmap visualizations using ECharts.

## 🔗 Live Demo
Try the application live at:

[Heatmap Generator](https://onursafa0.github.io/heatmap-generator/)

## ✨ Features

- 🎯 **Manual Data Input**: Dynamic grid creation and data entry
- 📊 **ECharts Integration**: Powerful and fast chart rendering engine
- 🎨 **Modern UI/UX**: Professional appearance
- 📱 **Responsive Design**: Compatible with all devices
- ⚡ **Real-time Updates**: Instant chart updates on data changes
- 📈 **Automatic Average Calculation**: Calculates and displays the average of all entered values
- 🎨 **Customizable Colors**: Yellow to red color palette
- 🔍 **Interactive Tooltip**: Detailed information on hover
- ✏️ **Customizable Title**: User-defined chart title
- 📥 **PDF Export**: Download generated charts in PDF format with data table

## 🛠️ Technologies

- **Frontend Framework**: Angular 20
- **Chart Library**: ECharts 6.0
- **PDF Library**: jsPDF 3.0
- **Programming Language**: TypeScript 5.8
- **Styling**: SCSS
- **Build Tool**: Angular CLI
- **Package Manager**: npm
- **Deployment**: GitHub Pages

## 🚀 Installation

Follow these steps to run the project on your computer.

### Requirements
- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v20 or higher)

### Steps

1. **Clone or download the repository**
   ```bash
   git clone https://github.com/Onursafa0/heatmap-generator
   cd heatmap-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:4200
   ```

### Build for Production

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy:gh
```

## 📖 Usage

### 1. Chart Title
- Enter a custom title for your chart
- The title will appear at the top of the chart

### 2. Grid Creation
- Set the number of rows and columns (1-50 range)
- Click "Generate Grid" button

### 3. Data Input
- Enter numerical values in the created grid
- Empty cells are automatically skipped

### 4. Chart Display
- Heatmap is automatically generated using ECharts
- Color scale goes from yellow to red
- Title appears at the top of the chart

### 5. Chart Export
- Click "Download PDF" to export the chart in PDF format
- The PDF includes both the heatmap and a data table
- Downloaded file is named with the title and includes generation date

### 6. Real-time Updates
- Chart updates instantly on data changes
- Chart updates automatically on title changes
- Detailed information display with tooltip

## 🎨 Customization

### Color Palette
The application uses a default yellow to red color transition:
- **Low values**: Yellow (`#ffffcc`)
- **Medium values**: Orange (`#fdae61`)
- **High values**: Red (`#a50026`)

### Grid Dimensions
- **Minimum**: 1x1
- **Maximum**: 50x50
- **Default**: 8x12

## 📊 PDF Export Features

The PDF export includes:
- **Heatmap visualization**: Color-coded data representation
- **Data table**: Excel-style table with all values
- **Column headers**: C1, C2, C3, etc.
- **Row labels**: R1, R2, R3, etc.
- **Generation date**: Automatically added to the PDF
- **Custom filename**: Based on the chart title

## 📁 Project Structure

```
heatmap-generator/
├── src/
│   ├── app/
│   │   ├── heatmap/
│   │   │   ├── heatmap.ts          # Main component logic
│   │   │   ├── heatmap.html        # Component template
│   │   │   └── heatmap.scss        # Component styles
│   │   ├── app.ts                  # Root component
│   │   ├── app.routes.ts           # Application routes
│   │   └── app.config.ts           # Application configuration
│   ├── main.ts                     # Application entry point
│   └── styles.scss                 # Global styles
├── package.json                    # Dependencies and scripts
└── README.md                       # Project documentation
```

## 🐛 Troubleshooting

### Common Issues

1. **Chart not displaying**: Make sure you have entered at least one valid numerical value in the grid
2. **PDF download fails**: Check if your browser supports PDF generation and has sufficient memory
3. **Grid not generating**: Ensure the form values are within the valid range (1-50 for rows/columns)

### Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
