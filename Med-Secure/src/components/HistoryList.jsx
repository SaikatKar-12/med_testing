import React from 'react';
import { formatDate } from '@/utils/dateUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarCheck, CalendarX, Trash } from 'lucide-react';

const HistoryList = ({ history, onClearHistory, onSelectItem }) => {
  if (history.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No scan history yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Scan History</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearHistory}
            className="text-destructive hover:text-destructive"
          >
            <Trash className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {history.map((item) => (
            <div 
              key={item.id}
              className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelectItem(item)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {item.isExpired === null ? (
                    <div className="p-1 bg-gray-100 rounded-full">
                      <CalendarX className="h-4 w-4 text-gray-500" />
                    </div>
                  ) : item.isExpired ? (
                    <div className="p-1 bg-medical-red/10 rounded-full">
                      <CalendarX className="h-4 w-4 text-medical-red" />
                    </div>
                  ) : (
                    <div className="p-1 bg-medical-green/10 rounded-full">
                      <CalendarCheck className="h-4 w-4 text-medical-green" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{item.productName || "Unknown Product"}</p>
                    <p className="text-xs text-gray-500">
                      Scanned: {new Date(item.scannedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {item.isExpired !== null && (
                  <Badge 
                    className={`text-xs ${
                      item.isExpired 
                        ? "bg-medical-red hover:bg-medical-red-dark" 
                        : "bg-medical-green hover:bg-medical-green-dark"
                    }`}
                  >
                    {item.isExpired ? "EXPIRED" : "VALID"}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryList;
