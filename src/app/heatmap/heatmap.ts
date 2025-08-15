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
  errorMessage: string | null = null;
  private chart: echarts.ECharts | null = null;

  @ViewChild('heatmapChart') private chartContainer!: ElementRef;

  constructor(private fb: FormBuilder) {
    this.configForm = this.fb.group({
      title: ['Sıcaklık Haritası', [Validators.required, Validators.maxLength(100)]],
      rows: [8, [Validators.required, Validators.min(1), Validators.max(50)]],
      cols: [12, [Validators.required, Validators.min(1), Validators.max(50)]],
    });
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

  onCellValueChange(value: string, rowIndex: number, colIndex: number): void {
    this.gridData[rowIndex][colIndex] = value === '' ? null : parseFloat(value);
    this.updateChart();
  }

  onTitleChange(): void {
    if (this.isGridGenerated) {
      this.updateChart();
    }
  }

  downloadPDF(): void {
    if (!this.chart) return;
    
    const dataURL = this.chart.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#ffffff'
    });
    
    this.convertPNGToPDF(dataURL);
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
    
    img.src = dataURL;
  }

  private createPDFFromCanvas(canvas: HTMLCanvasElement): void {
    try {
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth - 20; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      

      pdf.setFontSize(10);
      pdf.setTextColor(148, 163, 184); 
      const currentDate = new Date().toLocaleDateString('tr-TR');
      pdf.text(`Olusturulma Tarihi: ${currentDate}`, 10, pdfHeight - 10);
      
      const title = this.configForm.value.title || 'Sıcaklık Haritası';
      const fileName = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_heatmap.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      this.downloadCanvasAsPNG(canvas);
    }
  }

  private downloadCanvasAsPNG(canvas: HTMLCanvasElement): void {
    const link = document.createElement('a');
    const title = this.configForm.value.title || 'Sıcaklık Haritası';
    link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_heatmap.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  trackByRow(index: number, row: any[]): number {
    return index;
  }

  trackByCol(index: number, cell: number | null): number {
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

    const [min, max] = [Math.min(...allValues), Math.max(...allValues)];
    const average = allValues.reduce((sum, val) => sum + val, 0) / allValues.length;
    
    const data: [number, number, number][] = [];
    for (let i = 0; i < this.gridData.length; i++) {
      for (let j = 0; j < this.gridData[i].length; j++) {
        const value = this.gridData[i][j];
        if (value !== null && !isNaN(value)) {
          const yCoord = this.configForm.value.rows - 1 - i;
          data.push([j, yCoord, value]);
        }
      }
    }

    const option = {
      title: {
        text: this.configForm.value.title || 'Sıcaklık Haritası',
        left: 'center',
        top: '2%',
        textStyle: {
          color: '#000000',
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        position: 'top',
        formatter: function (params: any) {
          return `Sıcaklık: <b>${params.data[2].toFixed(2)}</b>`;
        }
      },
      grid: {
        height: '65%',
        top: '15%'
      },
      xAxis: {
        type: 'category',
        data: Array.from({ length: this.configForm.value.cols }, (_, i) => `S${i + 1}`),
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
        bottom: '5%',
        inRange: {
          color: ['#ffffcc', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        }
      },
      series: [{
        name: 'Sıcaklık',
        type: 'heatmap',
        data: data,
        label: {
          show: false
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }],
      graphic: [{
        type: 'text',
        left: 'left',
        bottom: 'bottom',
        style: {
          text: `Ortalama: ${average.toFixed(2)}`,
          fontSize: 16,
          fontWeight: 'bold',
          fill: '#000000',
          stroke: '#ffffff',
          strokeWidth: 2
        },
        position: [20, -20]
      }]
    };

    this.chart.setOption(option);
  }

  private getEmptyChartOption(): any {
    return {
      title: {
        text: this.configForm.value.title || 'Sıcaklık Haritası',
        left: 'center',
        top: '2%',
        textStyle: {
          color: '#000000',
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      xAxis: {
        type: 'category',
        data: [],
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: [],
        splitArea: {
          show: true
        }
      },
      series: [{
        name: 'Sıcaklık',
        type: 'heatmap',
        data: [],
        label: {
          show: false
        }
      }]
    };
  }
}