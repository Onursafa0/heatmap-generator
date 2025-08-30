# 🔥 Heatmap Generator

Modern and interactive heatmap generator application. Built with Angular, it allows users to create professional heatmap visualizations through manual data entry or random data generation.

## 🌐 Demo

[Live Demo](https://onursafa0.github.io/heatmap-generator/)

## ✨ Features

- **Manual Data Entry**: Dynamic grid creation and data input
- **Random Data Generation**: One-click realistic data generation (340-350 range)
- **Diamond Shape**: Special diamond-patterned heatmap
- **ECharts Integration**: Powerful and fast chart rendering engine
- **Dark/Light Theme**: Automatic theme switching with localStorage support
- **Responsive Design**: Compatible with all devices (mobile-first)
- **PDF Export**: Download generated charts in PDF format
- **Real-time Updates**: Instant chart updates on data changes

## 🛠️ Technologies

- **Frontend**: Angular 20, TypeScript 5.8.2
- **Charts**: ECharts 6.0
- **PDF**: jsPDF 3.0.1
- **Styling**: SCSS, CSS Grid/Flexbox
- **Deployment**: GitHub Pages

## 🚀 Installation

### Requirements
- Node.js (v18+)
- npm (v9+)
- Angular CLI (v20+)

### Steps

1. **Clone the repository**
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

### Production Build
```bash
npm run build
```

### GitHub Pages Deploy
```bash
npm run deploy:gh
```

## 📖 Usage

### 1. Configuration
- **Chart Title**: Enter a custom title (maximum 100 characters)
- **Grid Type**: Choose Standard (rectangle) or Diamond (diamond)
- **Grid Size**: 
  - Standard: Number of rows and columns (1-50)
  - Diamond: Diamond diameter (1-20)

### 2. Data Input
- **Manual**: Enter numerical values in grid cells
- **Random**: Generate automatic data with "Generate Random Data"
- **Diamond Grid**: Only diamond-shaped cells are active

### 3. Visualization
- Automatic heatmap generation with ECharts
- Yellow to red color scale
- Detailed information display on hover

### 4. Export
- Download chart and data table as PDF with "Download PDF"
- Large datasets supported with automatic pagination

## 🎨 Customization

### Theme System
- **Dark Theme**: Default dark theme
- **Light Theme**: Light theme
- Theme preference saved in localStorage

### Grid Types
- **Standard Grid**: Traditional rectangle grid
- **Diamond Grid**: Diamond-patterned special grid (Manhattan distance calculation)

## 📱 Responsive Design

- **Desktop**: 1400px maximum width
- **Tablet**: Optimized layout below 768px
- **Mobile**: Mobile-first design below 480px

## 🐛 Troubleshooting

### Common Issues
- **Chart not displaying**: Make sure you have at least one valid numerical value in the grid
- **PDF download failed**: Check browser support and memory status
- **Grid not generating**: Ensure form values are within valid range

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.
