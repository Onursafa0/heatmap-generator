import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import * as echarts from 'echarts';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-heatmap',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './heatmap.html',
  styleUrl: './heatmap.scss'
})
export class Heatmap implements AfterViewInit, OnDestroy {
  configForm: FormGroup;
  gridData: (number | null)[][] = [];
  isGridGenerated = false;
  isDarkMode = true;
  private chart: echarts.ECharts | null = null;

  @ViewChild('heatmapChart') private chartContainer!: ElementRef;

  constructor(private fb: FormBuilder) {
    this.configForm = this.fb.group({
      title: ['Heatmap', [Validators.required, Validators.maxLength(100)]],
      shape: ['rectangle', [Validators.required]],
      rows: [8, [Validators.required, Validators.min(1), Validators.max(50)]],
      cols: [12, [Validators.required, Validators.min(1), Validators.max(50)]],
      diamondSize: [5, [Validators.required, Validators.min(1), Validators.max(20)]],
    });
    
    this.initializeTheme();
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('heatmap-theme');
    if (savedTheme === 'light') {
      this.isDarkMode = false;
      this.applyTheme('light');
    } else {
      this.isDarkMode = true;
      this.applyTheme('dark');
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark' : 'light';
    this.applyTheme(theme);
    localStorage.setItem('heatmap-theme', theme);
    
    if (this.chart && this.isGridGenerated) {
      this.updateChart();
    }
  }

  private applyTheme(theme: 'dark' | 'light'): void {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  ngAfterViewInit(): void {
    if (this.isGridGenerated) {
      this.initChart();
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  generateGrid(): void {
    if (this.configForm.invalid) return;
    
    if (this.configForm.value.shape === 'diamond') {
      const diamondSize = this.configForm.value.diamondSize || 5;
      const gridSize = diamondSize;
      this.configForm.patchValue({
        rows: gridSize,
        cols: gridSize
      });
    }
    
    this.clearData();
    this.isGridGenerated = true;
    setTimeout(() => this.initChart(), 0);
  }

  clearData(): void {
    const rows = this.configForm.value.rows || 0;
    const cols = this.configForm.value.cols || 0;
    this.gridData = Array.from({ length: rows }, () => Array(cols).fill(null));
    if (this.isGridGenerated) {
      this.updateChart();
    }
  }

  generateRandomData(): void {
    if (!this.isGridGenerated) return;
    
    const rows = this.configForm.value.rows || 0;
    const cols = this.configForm.value.cols || 0;
    const shape = this.configForm.value.shape || 'rectangle';
    
    if (shape === 'rectangle') {
      this.generateRectangleData(rows, cols);
    } else if (shape === 'diamond') {
      this.generateDiamondData(rows, cols);
    }
    
    this.updateChart();
  }

  private generateRectangleData(rows: number, cols: number): void {
    const centerRow = (rows - 1) / 2;
    const centerCol = (cols - 1) / 2;
    const maxDistance = Math.sqrt(centerRow * centerRow + centerCol * centerCol);
    
    this.gridData = Array.from({ length: rows }, (_, i) => 
      Array.from({ length: cols }, (_, j) => {
        const distanceFromCenter = Math.sqrt(
          Math.pow(i - centerRow, 2) + Math.pow(j - centerCol, 2)
        );
        
        const temperatureFactor = 1 - (distanceFromCenter / maxDistance);
        
        const baseValue = 340;
        const range = 10;
        const weightedValue = baseValue + (range * temperatureFactor);
        
        const randomVariation = (Math.random() - 0.5) * 2;
        
        const finalValue = Math.max(340, Math.min(350, weightedValue + randomVariation));
        
        return Math.round(finalValue * 10) / 10;
      })
    );
  }

  private generateDiamondData(rows: number, cols: number): void {
    const centerRow = (rows - 1) / 2;
    const centerCol = (cols - 1) / 2;
    
    const diamondSize = this.configForm.value.diamondSize || 5;
    const radius = Math.floor(diamondSize / 2);
    
    this.gridData = Array.from({ length: rows }, (_, i) => 
      Array.from({ length: cols }, (_, j) => {
        const manhattanDistance = Math.abs(i - centerRow) + Math.abs(j - centerCol);
        
        if (manhattanDistance > radius) {
          return null;
        }
        
        const normalizedDistance = manhattanDistance / radius;
        const temperatureFactor = 1 - normalizedDistance;
        
        const baseValue = 340;
        const range = 10;
        const weightedValue = baseValue + (range * temperatureFactor);
        
        const randomVariation = (Math.random() - 0.5) * 2;
        
        const finalValue = Math.max(340, Math.min(350, weightedValue + randomVariation));
        
        return Math.round(finalValue * 10) / 10;
      })
    );
  }

  onCellValueChange(value: string, rowIndex: number, colIndex: number): void {
    if (this.isDiamondShape() && !this.isDiamondCell(rowIndex, colIndex)) {
      return;
    }
    
    this.gridData[rowIndex][colIndex] = value === '' ? null : parseFloat(value);
    this.updateChart();
  }

  onTitleChange(): void {
    if (this.isGridGenerated) {
      this.updateChart();
    }
  }

  onShapeChange(): void {
    if (this.isGridGenerated) {
      this.generateRandomData();
    }
  }

  isDiamondShape(): boolean {
    return this.configForm.value.shape === 'diamond';
  }

  isDiamondCell(row: number, col: number): boolean {
    if (!this.isDiamondShape()) return true;
    
    const rows = this.configForm.value.rows || 0;
    const cols = this.configForm.value.cols || 0;
    
    const centerRow = (rows - 1) / 2;
    const centerCol = (cols - 1) / 2;
    
    const diamondSize = this.configForm.value.diamondSize || 5;
    const radius = Math.floor(diamondSize / 2);
    
    const manhattanDistance = Math.abs(row - centerRow) + Math.abs(col - centerCol);
    
    return manhattanDistance <= radius;
  }

  downloadPDF(): void {
    if (!this.chart) return;
    
    const originalWidth = this.chartContainer.nativeElement.style.width;
    const originalHeight = this.chartContainer.nativeElement.style.height;
    const originalOption = this.chart.getOption();
    
    const pdfOption = {
      ...originalOption,
      title: {
        ...(originalOption as any).title,
        show: false
      }
    };
    this.chart.setOption(pdfOption);
    
    const desktopWidth = 1200;
    const desktopHeight = 800;
    
    this.chartContainer.nativeElement.style.width = desktopWidth + 'px';
    this.chartContainer.nativeElement.style.height = desktopHeight + 'px';
    this.chart.resize();
    
    setTimeout(() => {
      this.waitForChartRender().then(() => {
        if (!this.chart) return;
        const dataURL = this.chart.getDataURL({
          type: 'png',
          pixelRatio: 4,
          backgroundColor: '#ffffff'
        });
        
        this.chartContainer.nativeElement.style.width = originalWidth;
        this.chartContainer.nativeElement.style.height = originalHeight;
        this.chart.setOption(originalOption);
        this.chart.resize();
        
        this.convertPNGToPDF(dataURL);
      }).catch(() => {
        setTimeout(() => {
          if (this.chart) {
            const dataURL = this.chart.getDataURL({
              type: 'png',
              pixelRatio: 4,
              backgroundColor: '#ffffff'
            });
            
            this.chartContainer.nativeElement.style.width = originalWidth;
            this.chartContainer.nativeElement.style.height = originalHeight;
            this.chart.setOption(originalOption);
            this.chart.resize();
            
            this.convertPNGToPDF(dataURL);
          }
        }, 500);
      });
    }, 100);
  }

  private waitForChartRender(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.chart) {
        reject();
        return;
      }
      
      const checkRender = () => {
        try {
          const canvas = this.chart!.getDom().querySelector('canvas');
          if (canvas && canvas.width > 0 && canvas.height > 0) {
            resolve();
          } else {
            setTimeout(checkRender, 100);
          }
        } catch (error) {
          reject();
        }
      };
      
      checkRender();
      setTimeout(() => reject(), 3000);
    });
  }

  private convertPNGToPDF(dataURL: string): void {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        this.createPDFFromCanvas(canvas);
      }
    };
    
    img.onerror = () => {
      console.error('Image loading failed');
      this.downloadCanvasAsPNG(canvas);
    };
    
    img.src = dataURL;
  }

  private createPDFFromCanvas(canvas: HTMLCanvasElement): void {
    try {
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      this.createHeatmapPage(pdf, canvas, pdfWidth, pdfHeight);
      this.createDataTablePages(pdf, pdfWidth, pdfHeight);
      
      const title = this.configForm.value.title || 'Heatmap';
      const fileName = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_heatmap.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('PDF generation error:', error);
      this.downloadCanvasAsPNG(canvas);
    }
  }

  private createHeatmapPage(pdf: jsPDF, canvas: HTMLCanvasElement, pdfWidth: number, pdfHeight: number): void {
    const title = this.configForm.value.title || 'Heatmap';
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    const titleWidth = pdf.getTextWidth(title);
    pdf.text(title, (pdfWidth - titleWidth) / 2, 25);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    const subtitle = `Generated on ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`;
    const subtitleWidth = pdf.getTextWidth(subtitle);
    pdf.text(subtitle, (pdfWidth - subtitleWidth) / 2, 35);
    
    const chartTop = 50;
    const chartHeight = pdfHeight - 80;
    const chartWidth = pdfWidth - 40;
    const imgHeight = Math.min(chartHeight, (canvas.height * chartWidth) / canvas.width);
    
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 20, chartTop, chartWidth, imgHeight);
    
    pdf.setFontSize(10);
    pdf.setTextColor(148, 163, 184);
    const footerText = `Heatmap Generator - ${title}`;
    const footerWidth = pdf.getTextWidth(footerText);
    pdf.text(footerText, (pdfWidth - footerWidth) / 2, pdfHeight - 15);
  }

  private createDataTablePages(pdf: jsPDF, pdfWidth: number, pdfHeight: number): void {
    const rows = this.configForm.value.rows;
    const cols = this.configForm.value.cols;
    
    pdf.addPage();
    
    const title = this.configForm.value.title || 'Heatmap';
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    const pageTitle = `Data Values - ${title}`;
    const pageTitleWidth = pdf.getTextWidth(pageTitle);
    pdf.text(pageTitle, (pdfWidth - pageTitleWidth) / 2, 25);
    
    const allValues = this.gridData.flat().filter(d => d !== null && !isNaN(d)) as number[];
    if (allValues.length > 0) {
      const min = Math.min(...allValues);
      const max = Math.max(...allValues);
      const avg = allValues.reduce((sum, val) => sum + val, 0) / allValues.length;
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      const statsText = `Min: ${min.toFixed(2)} | Max: ${max.toFixed(2)} | Average: ${avg.toFixed(2)} | Total Values: ${allValues.length}`;
      const statsWidth = pdf.getTextWidth(statsText);
      pdf.text(statsText, (pdfWidth - statsWidth) / 2, 35);
    }
    
    const tableTop = 45;
    const tableWidth = pdfWidth - 40;
    const availableHeight = pdfHeight - tableTop - 20;
    
    if (cols > 24) {
      this.createWideDataTable(pdf, 20, tableTop, tableWidth, availableHeight, rows, cols);
    } else {
      const cellWidth = Math.max(10, tableWidth / cols);
      const cellHeight = Math.max(8, availableHeight / (rows + 1));
      const headerHeight = 10;
      const totalTableHeight = headerHeight + (rows * cellHeight);
      
      if (totalTableHeight > availableHeight) {
        this.createMultiPageDataTable(pdf, 20, tableTop, tableWidth, cellWidth, cellHeight, headerHeight, rows, cols, availableHeight);
      } else {
        this.createSinglePageDataTable(pdf, 20, tableTop, tableWidth, cellWidth, cellHeight, headerHeight, rows, cols);
      }
    }
  }

  private createSinglePageDataTable(pdf: jsPDF, tableLeft: number, tableTop: number, tableWidth: number, 
                                  cellWidth: number, cellHeight: number, headerHeight: number, rows: number, cols: number): void {
    const totalTableHeight = headerHeight + (rows * cellHeight);
    
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.rect(tableLeft, tableTop, tableWidth, totalTableHeight);
    
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    for (let j = 0; j < cols; j++) {
      const x = tableLeft + (j * cellWidth) + (cellWidth / 2);
      const y = tableTop + (headerHeight / 2) + 2;
      const text = `C${j + 1}`;
      const textWidth = pdf.getTextWidth(text);
      pdf.text(text, x - (textWidth / 2), y);
    }
    
    for (let i = 0; i < rows; i++) {
      const x = tableLeft - 5;
      const y = tableTop + headerHeight + (i * cellHeight) + (cellHeight / 2) + 2;
      const text = `R${i + 1}`;
      pdf.text(text, x, y);
    }
    
    for (let j = 1; j < cols; j++) {
      const x = tableLeft + (j * cellWidth);
      pdf.line(x, tableTop, x, tableTop + totalTableHeight);
    }
    
    for (let i = 1; i <= rows; i++) {
      const y = tableTop + headerHeight + (i * cellHeight);
      pdf.line(tableLeft, y, tableLeft + tableWidth, y);
    }
    
    pdf.setLineWidth(1);
    pdf.line(tableLeft, tableTop + headerHeight, tableLeft + tableWidth, tableTop + headerHeight);
    pdf.setLineWidth(0.5);
    
    this.writeSimpleTableValues(pdf, tableLeft, tableTop + headerHeight, cellWidth, cellHeight, rows, cols);
  }

  private createWideDataTable(pdf: jsPDF, tableLeft: number, tableTop: number, tableWidth: number, 
                            availableHeight: number, rows: number, cols: number): void {
    const colsPerPage = 24;
    const rowsPerPage = 18;
    const totalColPages = Math.ceil(cols / colsPerPage);
    const totalRowPages = Math.ceil(rows / rowsPerPage);
    
    const remainingCols = cols % colsPerPage;
    const minColsPerPage = 15;
    
    if (remainingCols > 0 && remainingCols < minColsPerPage && totalColPages > 1) {
      const colsToMove = minColsPerPage - remainingCols;
      const adjustedColsPerPage = colsPerPage - Math.ceil(colsToMove / (totalColPages - 1));
      
      for (let colPage = 0; colPage < totalColPages; colPage++) {
        for (let rowPage = 0; rowPage < totalRowPages; rowPage++) {
          if (colPage > 0 || rowPage > 0) {
            pdf.addPage();
            tableTop = 20;
          }
          
          let startCol, endCol;
          if (colPage === totalColPages - 1) {
            startCol = colPage * adjustedColsPerPage;
            endCol = cols;
          } else {
            startCol = colPage * adjustedColsPerPage;
            endCol = Math.min((colPage + 1) * adjustedColsPerPage, cols);
          }
          
          const pageCols = endCol - startCol;
          
          const startRow = rowPage * rowsPerPage;
          const endRow = Math.min((rowPage + 1) * rowsPerPage, rows);
          const pageRows = endRow - startRow;
          
          const cellWidth = Math.max(8, tableWidth / pageCols);
          const cellHeight = Math.max(8, availableHeight / (pageRows + 1));
          const headerHeight = 10;
          const totalTableHeight = headerHeight + (pageRows * cellHeight);
          
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 0, 0);
          const pageTitle = `Data Values (Rows ${startRow + 1}-${endRow}, Columns ${startCol + 1}-${endCol} of ${rows}x${cols})`;
          pdf.text(pageTitle, tableLeft, tableTop - 5);
          
          pdf.setDrawColor(0, 0, 0);
          pdf.setLineWidth(0.5);
          pdf.rect(tableLeft, tableTop, pageCols * cellWidth, totalTableHeight);
          
          pdf.setFontSize(7);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 0, 0);
          for (let j = 0; j < pageCols; j++) {
            const x = tableLeft + (j * cellWidth) + (cellWidth / 2);
            const y = tableTop + (headerHeight / 2) + 2;
            const text = `C${startCol + j + 1}`;
            const textWidth = pdf.getTextWidth(text);
            pdf.text(text, x - (textWidth / 2), y);
          }
          
          for (let i = 0; i < pageRows; i++) {
            const x = tableLeft - 5;
            const y = tableTop + headerHeight + (i * cellHeight) + (cellHeight / 2) + 2;
            const text = `R${startRow + i + 1}`;
            pdf.text(text, x, y);
          }
          
          for (let j = 1; j < pageCols; j++) {
            const x = tableLeft + (j * cellWidth);
            pdf.line(x, tableTop, x, tableTop + totalTableHeight);
          }
          
          for (let i = 1; i <= pageRows; i++) {
            const y = tableTop + headerHeight + (i * cellHeight);
            pdf.line(tableLeft, y, tableLeft + (pageCols * cellWidth), y);
          }
          
          pdf.setLineWidth(1);
          pdf.line(tableLeft, tableTop + headerHeight, tableLeft + (pageCols * cellWidth), tableTop + headerHeight);
          pdf.setLineWidth(0.5);
          
          this.writeWideTableValuesForPage(pdf, tableLeft, tableTop + headerHeight, cellWidth, cellHeight, startRow, endRow, startCol, endCol);
        }
      }
    } else {
      for (let colPage = 0; colPage < totalColPages; colPage++) {
        for (let rowPage = 0; rowPage < totalRowPages; rowPage++) {
          if (colPage > 0 || rowPage > 0) {
            pdf.addPage();
            tableTop = 20;
          }
          
          const startCol = colPage * colsPerPage;
          const endCol = Math.min((colPage + 1) * colsPerPage, cols);
          const pageCols = endCol - startCol;
          
          const startRow = rowPage * rowsPerPage;
          const endRow = Math.min((rowPage + 1) * rowsPerPage, rows);
          const pageRows = endRow - startRow;
          
          const cellWidth = Math.max(8, tableWidth / pageCols);
          const cellHeight = Math.max(8, availableHeight / (pageRows + 1));
          const headerHeight = 10;
          const totalTableHeight = headerHeight + (pageRows * cellHeight);
          
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 0, 0);
          const pageTitle = `Data Values (Rows ${startRow + 1}-${endRow}, Columns ${startCol + 1}-${endCol} of ${rows}x${cols})`;
          pdf.text(pageTitle, tableLeft, tableTop - 5);
          
          pdf.setDrawColor(0, 0, 0);
          pdf.setLineWidth(0.5);
          pdf.rect(tableLeft, tableTop, pageCols * cellWidth, totalTableHeight);
          
          pdf.setFontSize(7);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 0, 0);
          for (let j = 0; j < pageCols; j++) {
            const x = tableLeft + (j * cellWidth) + (cellWidth / 2);
            const y = tableTop + (headerHeight / 2) + 2;
            const text = `C${startCol + j + 1}`;
            const textWidth = pdf.getTextWidth(text);
            pdf.text(text, x - (textWidth / 2), y);
          }
          
          for (let i = 0; i < pageRows; i++) {
            const x = tableLeft - 5;
            const y = tableTop + headerHeight + (i * cellHeight) + (cellHeight / 2) + 2;
            const text = `R${startRow + i + 1}`;
            pdf.text(text, x, y);
          }
          
          for (let j = 1; j < pageCols; j++) {
            const x = tableLeft + (j * cellWidth);
            pdf.line(x, tableTop, x, tableTop + totalTableHeight);
          }
          
          for (let i = 1; i <= pageRows; i++) {
            const y = tableTop + headerHeight + (i * cellHeight);
            pdf.line(tableLeft, y, tableLeft + (pageCols * cellWidth), y);
          }
          
          pdf.setLineWidth(1);
          pdf.line(tableLeft, tableTop + headerHeight, tableLeft + (pageCols * cellWidth), tableTop + headerHeight);
          pdf.setLineWidth(0.5);
          
          this.writeWideTableValuesForPage(pdf, tableLeft, tableTop + headerHeight, cellWidth, cellHeight, startRow, endRow, startCol, endCol);
        }
      }
    }
  }

  private createMultiPageDataTable(pdf: jsPDF, tableLeft: number, tableTop: number, tableWidth: number, 
                                 cellWidth: number, cellHeight: number, headerHeight: number, rows: number, cols: number, 
                                 availableHeight: number): void {
    const rowsPerPage = Math.floor(availableHeight / cellHeight);
    const totalPages = Math.ceil(rows / rowsPerPage);
    
    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        pdf.addPage();
        tableTop = 20;
      }
      
      const startRow = page * rowsPerPage;
      const endRow = Math.min((page + 1) * rowsPerPage, rows);
      const pageRows = endRow - startRow;
      const pageHeight = headerHeight + (pageRows * cellHeight);
      
      if (totalPages > 1) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Data Values (Page ${page + 1}/${totalPages})`, tableLeft, tableTop - 5);
      }
      
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.rect(tableLeft, tableTop, tableWidth, pageHeight);
      
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      for (let j = 0; j < cols; j++) {
        const x = tableLeft + (j * cellWidth) + (cellWidth / 2);
        const y = tableTop + (headerHeight / 2) + 2;
        const text = `C${j + 1}`;
        const textWidth = pdf.getTextWidth(text);
        pdf.text(text, x - (textWidth / 2), y);
      }
      
      for (let i = startRow; i < endRow; i++) {
        const x = tableLeft - 5;
        const y = tableTop + headerHeight + ((i - startRow) * cellHeight) + (cellHeight / 2) + 2;
        const text = `R${i + 1}`;
        pdf.text(text, x, y);
      }
      
      for (let j = 1; j < cols; j++) {
        const x = tableLeft + (j * cellWidth);
        pdf.line(x, tableTop, x, tableTop + pageHeight);
      }
      
      for (let i = 1; i <= pageRows; i++) {
        const y = tableTop + headerHeight + (i * cellHeight);
        pdf.line(tableLeft, y, tableLeft + tableWidth, y);
      }
      
      pdf.setLineWidth(1);
      pdf.line(tableLeft, tableTop + headerHeight, tableLeft + tableWidth, tableTop + headerHeight);
      pdf.setLineWidth(0.5);
      
      this.writeSimpleTableValuesForPage(pdf, tableLeft, tableTop + headerHeight, cellWidth, cellHeight, startRow, endRow, cols);
    }
  }

  private writeSimpleTableValues(pdf: jsPDF, tableLeft: number, tableTop: number, cellWidth: number, 
                               cellHeight: number, rows: number, cols: number): void {
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const value = this.gridData[i][j];
        const x = tableLeft + (j * cellWidth) + (cellWidth / 2);
        const y = tableTop + (i * cellHeight) + (cellHeight / 2) + 2;
        
        if (value !== null && !isNaN(value)) {
          const text = value.toFixed(1);
          const textWidth = pdf.getTextWidth(text);
          pdf.setTextColor(0, 0, 0);
          pdf.text(text, x - (textWidth / 2), y);
        } else {
          const text = '-';
          const textWidth = pdf.getTextWidth(text);
          pdf.setTextColor(150, 150, 150);
          pdf.text(text, x - (textWidth / 2), y);
        }
      }
    }
  }

  private writeSimpleTableValuesForPage(pdf: jsPDF, tableLeft: number, tableTop: number, cellWidth: number, 
                                      cellHeight: number, startRow: number, endRow: number, cols: number): void {
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    
    for (let i = startRow; i < endRow; i++) {
      for (let j = 0; j < cols; j++) {
        const value = this.gridData[i][j];
        const x = tableLeft + (j * cellWidth) + (cellWidth / 2);
        const y = tableTop + ((i - startRow) * cellHeight) + (cellHeight / 2) + 2;
        
        if (value !== null && !isNaN(value)) {
          const text = value.toFixed(1);
          const textWidth = pdf.getTextWidth(text);
          pdf.setTextColor(0, 0, 0);
          pdf.text(text, x - (textWidth / 2), y);
        } else {
          const text = '-';
          const textWidth = pdf.getTextWidth(text);
          pdf.setTextColor(150, 150, 150);
          pdf.text(text, x - (textWidth / 2), y);
        }
      }
    }
  }

  private writeWideTableValuesForPage(pdf: jsPDF, tableLeft: number, tableTop: number, cellWidth: number, 
                                    cellHeight: number, startRow: number, endRow: number, startCol: number, endCol: number): void {
    pdf.setFontSize(6);
    pdf.setFont('helvetica', 'normal');
    
    for (let i = startRow; i < endRow; i++) {
      for (let j = startCol; j < endCol; j++) {
        const value = this.gridData[i][j];
        const x = tableLeft + ((j - startCol) * cellWidth) + (cellWidth / 2);
        const y = tableTop + ((i - startRow) * cellHeight) + (cellHeight / 2) + 2;
        
        if (value !== null && !isNaN(value)) {
          const text = value.toFixed(1);
          const textWidth = pdf.getTextWidth(text);
          pdf.setTextColor(0, 0, 0);
          pdf.text(text, x - (textWidth / 2), y);
        } else {
          const text = '-';
          const textWidth = pdf.getTextWidth(text);
          pdf.setTextColor(150, 150, 150);
          pdf.text(text, x - (textWidth / 2), y);
        }
      }
    }
  }

  private downloadCanvasAsPNG(canvas: HTMLCanvasElement): void {
    const link = document.createElement('a');
    const title = this.configForm.value.title || 'Heatmap';
    link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_heatmap.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  trackByRow(index: number): number {
    return index;
  }

  trackByCol(index: number): number {
    return index;
  }

  private initChart(): void {
    if (!this.chartContainer) return;

    if (this.chart) {
      this.chart.dispose();
    }

    this.chart = echarts.init(this.chartContainer.nativeElement);
    this.updateChart();
  }

  private updateChart(): void {
    if (!this.chart || !this.isGridGenerated) return;

    const allValues = this.gridData.flat().filter(d => d !== null && !isNaN(d)) as number[];
    
    if (allValues.length === 0) {
      this.chart.setOption(this.getEmptyChartOption());
      return;
    }

    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const average = allValues.reduce((sum, val) => sum + val, 0) / allValues.length;
    const shape = this.configForm.value.shape || 'rectangle';
    
    const data: [number, number, number][] = [];
    for (let i = 0; i < this.gridData.length; i++) {
      for (let j = 0; j < this.gridData[i].length; j++) {
        const value = this.gridData[i][j];
        const yCoord = this.configForm.value.rows - 1 - i;
        if (value !== null && !isNaN(value)) {
          data.push([j, yCoord, value]);
        } else {
          data.push([j, yCoord, null as any]);
        }
      }
    }

    const textColor = this.isDarkMode ? '#f0e9e2' : '#1e293b';
    const tooltipBg = this.isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)';
    const tooltipBorder = this.isDarkMode ? '#334155' : '#ccc';
    const tooltipTextColor = this.isDarkMode ? '#f0e9e2' : '#333';
    const visualMapTextColor = this.isDarkMode ? '#f0e9e2' : '#333';
    const graphicTextColor = this.isDarkMode ? '#f0e9e2' : '#000000';
    const graphicStrokeColor = this.isDarkMode ? '#1e293b' : '#ffffff';

    const option = {
      title: {
        text: `${this.configForm.value.title || 'Heatmap'} (${shape === 'diamond' ? 'Diamond' : 'Standard Grid'})`,
        left: 'center',
        top: '3%',
        textStyle: {
          color: textColor,
          fontSize: 20,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        position: 'top',
        backgroundColor: tooltipBg,
        borderColor: tooltipBorder,
        borderWidth: 1,
        textStyle: {
          color: tooltipTextColor
        },
        formatter: function (params: any) {
          const value = params.data[2];
          return `<b>${typeof value === 'number' ? value.toFixed(2) : value}</b>`;
        }
      },
      grid: {
        height: '60%',
        top: '18%',
        left: '10%',
        right: '10%'
      },
      xAxis: {
        type: 'category',
        data: Array.from({ length: this.configForm.value.cols }, (_, i) => `C${i + 1}`),
        splitArea: {
          show: true
        },
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        }
      },
      yAxis: {
        type: 'category',
        data: Array.from({ length: this.configForm.value.rows }, (_, i) => `R${i + 1}`).reverse(),
        splitArea: {
          show: true
        },
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        }
      },
      visualMap: {
        min: min,
        max: max,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '8%',
        itemWidth: 20,
        itemHeight: 120,
        textStyle: {
          fontSize: 12,
          color: visualMapTextColor
        },
        inRange: {
          color: ['#ffffcc', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        }
      },
      series: [{
        name: 'Value',
        type: 'heatmap',
        data: data,
        label: {
          show: false
        },
        itemStyle: {
          borderColor: this.isDarkMode ? '#334155' : '#fff',
          borderWidth: 1
        },
        silent: false,
        animation: false,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: this.isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
            borderWidth: 2,
            borderColor: this.isDarkMode ? '#0ea5e9' : '#333'
          }
        }
      }],
      graphic: [{
        type: 'text',
        left: 'left',
        bottom: 'bottom',
        style: {
          text: `Average: ${average.toFixed(2)} | Pattern: ${shape === 'diamond' ? 'Diamond' : 'Standard Grid'}`,
          fontSize: 14,
          fontWeight: 'bold',
          fill: graphicTextColor,
          stroke: graphicStrokeColor,
          strokeWidth: 2
        },
        position: [20, -30]
      }]
    };

    this.chart.setOption(option);
  }

  private getEmptyChartOption(): any {
    const textColor = this.isDarkMode ? '#f0e9e2' : '#1e293b';
    const visualMapTextColor = this.isDarkMode ? '#f0e9e2' : '#333';
    const borderColor = this.isDarkMode ? '#334155' : '#fff';

    return {
      title: {
        text: this.configForm.value.title || 'Heatmap',
        left: 'center',
        top: '3%',
        textStyle: {
          color: textColor,
          fontSize: 20,
          fontWeight: 'bold'
        }
      },
      grid: {
        height: '60%',
        top: '18%',
        left: '10%',
        right: '10%'
      },
      xAxis: {
        type: 'category',
        data: [],
        splitArea: {
          show: true
        },
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        }
      },
      yAxis: {
        type: 'category',
        data: [],
        splitArea: {
          show: true
        },
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        }
      },
      visualMap: {
        min: 0,
        max: 1,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '8%',
        itemWidth: 20,
        itemHeight: 120,
        textStyle: {
          fontSize: 12,
          color: visualMapTextColor
        },
        inRange: {
          color: ['#ffffcc', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        }
      },
      series: [{
        name: 'Value',
        type: 'heatmap',
        data: [],
        label: {
          show: false
        },
        itemStyle: {
          borderColor: borderColor,
          borderWidth: 1
        }
      }]
    };
  }
}
