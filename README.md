# 🔥 Heatmap Generator

Modern and interactive heatmap generator application built with Angular and Electron. Create professional heatmap visualizations through manual data entry or random data generation. Available as both a web application and a standalone desktop application.

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
- **Cross-Platform Desktop App**: Standalone executable for Windows

## 🛠️ Technologies

- **Frontend**: Angular 20, TypeScript 5.8.2
- **Desktop**: Electron 37.4.0
- **Charts**: ECharts 6.0
- **PDF**: jsPDF 3.0.1
- **Styling**: SCSS, CSS Grid/Flexbox
- **Deployment**: GitHub Pages
- **Build Tools**: electron-builder, electron-packager

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

## 🏗️ Build Options

### Web Application
```bash
# Production build for web
npm run build
```

### Desktop Application
```bash
# Build standalone executable for Windows
npm run build:portable
```

### Development Options
```bash
# Start Electron in development mode
npm run electron:dev

# Build and run Electron
npm run electron:build

# Package with electron-packager
npm run electron:pack
```

### GitHub Pages Deploy
```bash
npm run deploy:gh
```

## 💻 Desktop Application

The application can be built as a standalone Windows executable that runs without installation:

- **Portable Executable**: Single `.exe` file that can be run from any location
- **No Installation Required**: Just download and run
- **Offline Capability**: Works completely offline once built
- **Native Performance**: Electron-based desktop experience

### Building the Desktop App

1. **Build the web application first:**
   ```bash
   npm run build
   ```

2. **Create portable executable:**
   ```bash
   npm run build:portable
   ```

3. **Find the executable:**
   - Location: `dist-electron/Heatmap Generator.exe`
   - This is a standalone file that can be distributed and run on any Windows machine

## 📖 Usage

### 1. Configuration
- **Chart Title**: Enter a custom title (maximum 100 characters)
- **Grid Type**: Choose Standard (rectangle) or Diamond (diamond)
- **Grid Size**: 
  - Standard: Number of rows and columns (1-50)
  - Diamond: Diamond diameter (1-60)

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
- **Desktop app not starting**: Ensure you have the latest Windows updates and Visual C++ Redistributables

### Desktop App Issues
- **Executable not found**: Check that `npm run build:portable` completed successfully
- **Permission errors**: Run as administrator if needed
- **Antivirus warnings**: The executable is safe; you may need to add an exception

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.
