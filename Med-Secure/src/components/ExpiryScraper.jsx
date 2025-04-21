import React, { useState, useEffect } from 'react';
import { parseExpiryDate } from '@/utils/dateUtils';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Search, CalendarCheck, CalendarX } from 'lucide-react';

const ExpiryScraper = ({ url, onResult, onReset }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    scrapeWebsite(url)
      .then((data) => {
        if (data) {
          const result = {
            id: generateId(),
            scannedAt: new Date(),
            qrContent: url,
            sourceUrl: url,
            expiryDate: data.expiryDate,
            isExpired: data.expiryDate ? data.expiryDate < new Date() : null,
            productName: data.productName || extractProductNameFromUrl(url),
          };

          onResult(result);

          if (result.isExpired === true) {
            toast({
              title: "Expired Medicine!",
              description: "This medicine has expired and should not be used.",
              variant: "destructive",
            });
          } else if (result.isExpired === false) {
            toast({
              title: "Medicine Still Valid",
              description: "This medicine has not expired yet.",
            });
          }
        } else {
          setError("Could not find expiry information on the linked page");
        }
      })
      .catch((err) => {
        console.error("Scraping failed:", err);
        setError(`Failed to extract expiry date: ${err.message || 'Unknown error'}`);

        const result = {
          id: generateId(),
          scannedAt: new Date(),
          qrContent: url,
          sourceUrl: url,
          expiryDate: null,
          isExpired: null,
          error: `Failed to extract expiry date: ${err.message || 'Unknown error'}`
        };

        onResult(result);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [url]);

  const scrapeWebsite = async (url) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockScrapedText = "Product Information: TestMedicine-500mg\n" +
          "Manufacturing Date: Jan-2025\n" +
          "Expiration Date: Dec-2026\n" +
          "Store in a cool, dry place";

        const expiryDate = parseExpiryDate(mockScrapedText);
        const productName = extractProductNameFromUrl(url);

        resolve({ expiryDate, productName });
      }, 2000);
    });
  };

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const extractProductNameFromUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split('/').filter(Boolean);
      if (pathSegments.length > 0) {
        const lastSegment = pathSegments[pathSegments.length - 1];
        return lastSegment
          .replace(/-|_/g, ' ')
          .replace(/\.\w+$/, '')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }

      return urlObj.hostname
        .replace('www.', '')
        .split('.')
        .shift() || 'Unknown Product';
    } catch (e) {
      return 'Unknown Product';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <Search className="h-8 w-8 animate-spin text-medical-blue mb-2" />
              <h3 className="text-lg font-medium mb-2">Analyzing Website</h3>
              <p className="text-sm text-gray-500">
                Scanning for expiry information in {url}
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center">
              <CalendarX className="h-8 w-8 text-medical-red mb-2" />
              <h3 className="text-lg font-medium mb-2">Error</h3>
              <p className="text-sm text-gray-500">{error}</p>
              <button 
                onClick={onReset}
                className="mt-4 text-medical-blue hover:underline"
              >
                Scan Another
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <CalendarCheck className="h-8 w-8 text-medical-green mb-2" />
              <h3 className="text-lg font-medium mb-2">Analysis Complete</h3>
              <p className="text-sm text-gray-500">
                Results will be displayed below
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpiryScraper;
