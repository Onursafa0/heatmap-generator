# 🔥 Heatmap Generator

Modern ve interaktif heatmap grafikleri oluşturabilen Angular tabanlı web uygulaması. Kullanıcılar manuel olarak veri girebilir ve ECharts ile profesyonel heatmap görselleştirmeleri elde edebilir.

## 🔗 Uygulama Linki
Uygulamayı canlı olarak denemek için aşağıdaki bağlantıyı ziyaret edebilirsiniz:

https://onursafa0.github.io/heatmap-generator/

## ✨ Özellikler

- 🎯 **Manuel Veri Girişi**: Dinamik grid oluşturma ve veri girişi
- 📊 **ECharts Entegrasyonu**: Güçlü ve hızlı grafik render motoru
- 🎨 **Modern UI/UX**: Profesyonel görünüm
- 📱 **Responsive Tasarım**: Tüm cihazlarla uyumlu görünüm
- ⚡ **Gerçek Zamanlı Güncelleme**: Veri değişikliklerinde anında grafik güncelleme
- 📈 **Otomatik Ortalama Hesabı:** Grafiğe girilen tüm değerlerin ortalamasını anlık olarak hesaplar ve gösterir.
- 🎨 **Özelleştirilebilir Renkler**: Sarıdan kırmızıya doğru renk paleti
- 🔍 **Interaktif Tooltip**: Hover durumunda detaylı bilgi gösterimi
- ✏️ **Özelleştirilebilir Başlık**: Kullanıcı tarafından girilebilen grafik başlığı
- 📥 **PDF İndirme**: Oluşturulan grafiği PDF formatında indirme özelliği

## 🛠️ Teknolojiler

- **Frontend Framework**: Angular 20
- **Grafik Kütüphanesi**: ECharts 6.0
- **PDF Kütüphanesi**: jsPDF
- **Programlama Dili**: TypeScript
- **Styling**: SCSS
- **Build Tool**: Angular CLI
- **Package Manager**: npm

## 🚀 Kurulum

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz.

### Gereksinimler
- Node.js (v18 veya üzeri)
- npm (v9 veya üzeri)

### Adımlar

1. **Repoyu klonlayın veya indirin**
   ```bash
   git clone [https://github.com/Onursafa0/HeatmapGenerator.git](https://github.com/Onursafa0/heatmap-generator)
   cd HeatmapGenerator
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Geliştirme sunucusunu başlatın**
   ```bash
   npm start
   ```

4. **Tarayıcıda açın**
   ```
   http://localhost:4200
   ```

## 📖 Kullanım

### 1. Grafik Başlığı
- Grafik için özel başlık girin
- Başlık grafiğin üstünde görünecek

### 2. Grid Oluşturma
- Satır ve sütun sayısını belirleyin (1-50 arası)
- "Grid Oluştur" butonuna tıklayın

### 3. Veri Girişi
- Oluşturulan grid'e sayısal değerler girin
- Boş hücreler otomatik olarak atlanır

### 4. Grafik Görüntüleme
- ECharts ile heatmap otomatik olarak oluşturulur
- Renk skalası sarıdan kırmızıya doğru gider
- Başlık grafiğin üstünde görünür

### 5. Grafik İndirme
- "PDF İndir" butonuna tıklayarak grafiği PDF formatında indirin
- İndirilen PDF dosyası başlık ile adlandırılır ve oluşturulma tarihi içerir

### 6. Gerçek Zamanlı Güncelleme
- Veri değişikliklerinde grafik anında güncellenir
- Başlık değişikliklerinde grafik otomatik güncellenir
- Tooltip ile detaylı bilgi görüntüleme

## 🎨 Özelleştirme

### Renk Paleti
Uygulama varsayılan olarak sarıdan kırmızıya doğru renk geçişi kullanır:
- **Düşük değerler**: Sarı (`#ffffcc`)
- **Orta değerler**: Turuncu (`#fdae61`)
- **Yüksek değerler**: Kırmızı (`#a50026`)

### Grid Boyutları
- **Minimum**: 1x1
- **Maksimum**: 50x50
- **Varsayılan**: 8x12
---
