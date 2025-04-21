const STORAGE_KEY = 'medicineScans';

/**
 * Saves a scan result to local storage
 * @param {Object} result - The scan result object
 */
export const saveScanResult = (result) => {
  try {
    const existingData = getScanHistory();
    const updatedData = [result, ...existingData];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error saving scan result:', error);
  }
};

/**
 * Gets all scan history from local storage
 * @returns {Array<Object>} - List of scan results
 */
export const getScanHistory = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const parsedData = JSON.parse(data);
    return parsedData.map((item) => ({
      ...item,
      scannedAt: new Date(item.scannedAt),
      expiryDate: item.expiryDate ? new Date(item.expiryDate) : null,
    }));
  } catch (error) {
    console.error('Error getting scan history:', error);
    return [];
  }
};

/**
 * Clears all scan history from local storage
 */
export const clearScanHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing scan history:', error);
  }
};
