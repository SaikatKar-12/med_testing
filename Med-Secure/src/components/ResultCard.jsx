import React from 'react';
import { formatDate } from '@/utils/dateUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarCheck, CalendarX, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const ResultCard = ({ result, onReset }) => {
  const handleOpenUrl = () => {
    if (result.sourceUrl) {
      window.open(result.sourceUrl, '_blank');
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">
            {result.productName || "Medicine Details"}
          </CardTitle>
          {result.isExpired !== null && (
            <Badge 
              className={`text-sm ${
                result.isExpired 
                  ? "bg-medical-red hover:bg-medical-red-dark" 
                  : "bg-medical-green hover:bg-medical-green-dark"
              }`}
            >
              {result.isExpired ? "EXPIRED" : "VALID"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {result.isExpired === null ? (
              <div className="p-2 bg-gray-100 rounded-full">
                <CalendarX className="h-5 w-5 text-gray-500" />
              </div>
            ) : result.isExpired ? (
              <div className="p-2 bg-medical-red/10 rounded-full">
                <CalendarX className="h-5 w-5 text-medical-red-dark" />
              </div>
            ) : (
              <div className="p-2 bg-medical-green/10 rounded-full">
                <CalendarCheck className="h-5 w-5 text-medical-green-dark" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium">Expiry Date</p>
              <p className={`text-base ${
                result.isExpired ? "text-medical-red-dark" : ""
              }`}>
                {formatDate(result.expiryDate)}
              </p>
            </div>
          </div>

          {result.error && (
            <div className="mt-2 p-3 bg-medical-red/10 text-medical-red-dark rounded-md text-sm">
              {result.error}
            </div>
          )}

          <div className="pt-2 flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleOpenUrl}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Source
            </Button>
            <Button 
              className="flex-1"
              onClick={onReset}
            >
              Scan Another
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultCard;
