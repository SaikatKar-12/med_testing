import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Upload } from 'lucide-react';
import QrScanner from '@/components/QrScanner';
import QrUpload from '@/components/QrUpload';
import ExpiryScraper from '@/components/ExpiryScraper';
import ResultCard from '@/components/ResultCard';
import HistoryList from '@/components/HistoryList';
import { getScanHistory, saveScanResult, clearScanHistory } from '@/utils/storage';

const Index = () => {
  const [activeTab, setActiveTab] = useState("scan");
  const [isScanning, setIsScanning] = useState(false);
  const [scannedUrl, setScannedUrl] = useState(null);
  const [currentResult, setCurrentResult] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  // Load scan history on component mount
  useEffect(() => {
    const history = getScanHistory();
    setScanHistory(history);
  }, []);

  // Handle successful QR code scan
  const handleScan = (url) => {
    setScannedUrl(url);
    setCurrentResult(null);
  };

  // Handle successful scraping result
  const handleScrapingResult = (result) => {
    setCurrentResult(result);

    // Save to history
    saveScanResult(result);
    setScanHistory([result, ...scanHistory]);
  };

  // Reset scan state
  const handleReset = () => {
    setScannedUrl(null);
    setCurrentResult(null);
    setIsScanning(false);
  };

  // Clear scan history
  const handleClearHistory = () => {
    clearScanHistory();
    setScanHistory([]);
  };

  // Select a history item
  const handleSelectHistoryItem = (item) => {
    setCurrentResult(item);
    setScannedUrl(item.sourceUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container max-w-3xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <QrCode className="h-6 w-6 text-medical-blue" />
              <h1 className="text-xl font-bold text-gray-900">MediCheck QR Expiry Scanner</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {currentResult ? (
          <ResultCard result={currentResult} onReset={handleReset} />
        ) : scannedUrl ? (
          <ExpiryScraper 
            url={scannedUrl} 
            onResult={handleScrapingResult}
            onReset={handleReset}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="scan" onClick={() => setIsScanning(false)}>
                <QrCode className="mr-2 h-4 w-4" />
                Camera Scan
              </TabsTrigger>
              <TabsTrigger value="upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </TabsTrigger>
            </TabsList>
            <TabsContent value="scan">
              <QrScanner 
                onScan={handleScan} 
                isScanning={isScanning} 
                setIsScanning={setIsScanning} 
              />
            </TabsContent>
            <TabsContent value="upload">
              <QrUpload onScan={handleScan} />
            </TabsContent>
          </Tabs>
        )}

        {/* History section */}
        {!scannedUrl && (
          <HistoryList 
            history={scanHistory}
            onClearHistory={handleClearHistory}
            onSelectItem={handleSelectHistoryItem}
          />
        )}
      </main>

      <footer className="bg-white border-t mt-10">
        <div className="container max-w-3xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            MediCheck QR - Scan medicine QR codes to check expiry dates
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
