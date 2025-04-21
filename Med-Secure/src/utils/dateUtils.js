/**
 * Checks if a date is expired (before current date)
 */
export const isExpired = (date) => {
    if (!date) return null;
    const now = new Date();
    return date < now;
  };
  
  /**
   * Formats a date to a readable string
   */
  export const formatDate = (date) => {
    if (!date) return 'Unknown';
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  /**
   * Attempts to parse a date string from various potential formats
   */
  export const parseExpiryDate = (text) => {
    const expiryPatterns = [
      /exp(?:iry|\.)?(?:\s*date)?[\s:]*([a-z]+[-\s]?\d{4})/i,
      /exp(?:iry|\.)?(?:\s*date)?[\s:]*(\d{1,2}[-\/\s][a-z]+[-\/\s]\d{4})/i,
      /exp(?:iry|\.)?(?:\s*date)?[\s:]*(\d{1,2}[-\/\s]\d{1,2}[-\/\s]\d{4})/i,
      /(?:exp|expiry|expiration|expires)[\s:]*([a-z]{3,9}[-\s]?\d{4})/i,
      /use\s+by[\s:]*([a-z]+[-\s]?\d{4})/i,
      /best\s+before[\s:]*([a-z]+[-\s]?\d{4})/i
    ];
    
    for (const pattern of expiryPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const dateString = match[1].trim();
        const parsedDate = tryParseDateFormats(dateString);
        if (parsedDate) return parsedDate;
      }
    }
  
    const datePatterns = [
      /([a-z]{3,9})[\s-]+(\d{4})/i,
      /(\d{4})[-\/](\d{1,2})/,
      /(\d{1,2})[-\/](\d{4})/,
      /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/,
      /(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/,
    ];
  
    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        try {
          const parsedDate = tryParseDateMatch(match);
          if (parsedDate) return parsedDate;
        } catch (e) {
          console.error("Error parsing date:", e);
        }
      }
    }
    
    if (text.toLowerCase().includes("mfg") && text.toLowerCase().includes("exp")) {
      const sections = text.split(/\b(mfg|exp)\b/i);
      for (let i = 0; i < sections.length; i++) {
        if (/exp/i.test(sections[i]) && i + 1 < sections.length) {
          const expirySection = sections[i + 1];
          for (const pattern of datePatterns) {
            const match = expirySection.match(pattern);
            if (match) {
              try {
                const parsedDate = tryParseDateMatch(match);
                if (parsedDate) return parsedDate;
              } catch (e) {
                console.error("Error parsing expiry date section:", e);
              }
            }
          }
          const monthYearMatch = expirySection.match(/([a-z]{3,9})[\s-]+(\d{4})/i);
          if (monthYearMatch) {
            const monthStr = monthYearMatch[1];
            const yearStr = monthYearMatch[2];
            const parsedDate = parseMonthYear(monthStr, yearStr);
            if (parsedDate) return parsedDate;
          }
        }
      }
    }
    
    const mfgExpPattern = /([a-z]{3,9})[-\s]?(\d{4}).*?(?:and|&|\s+).*?([a-z]{3,9})[-\s]?(\d{4})/i;
    const mfgExpMatch = text.match(mfgExpPattern);
    if (mfgExpMatch) {
      const expMonthStr = mfgExpMatch[3];
      const expYearStr = mfgExpMatch[4];
      const parsedDate = parseMonthYear(expMonthStr, expYearStr);
      if (parsedDate) return parsedDate;
    }
  
    return null;
  };
  
  const tryParseDateFormats = (dateString) => {
    const monthYearMatch = dateString.match(/([a-z]{3,9})[-\s]?(\d{4})/i);
    if (monthYearMatch) {
      const monthStr = monthYearMatch[1];
      const yearStr = monthYearMatch[2];
      return parseMonthYear(monthStr, yearStr);
    }
  
    const dateMatch = dateString.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
    if (dateMatch) {
      return tryParseDateMatch(dateMatch);
    }
  
    return null;
  };
  
  const parseMonthYear = (monthStr, yearStr) => {
    const months = {
      'jan': 0, 'january': 0,
      'feb': 1, 'february': 1,
      'mar': 2, 'march': 2,
      'apr': 3, 'april': 3,
      'may': 4, 
      'jun': 5, 'june': 5,
      'jul': 6, 'july': 6, 
      'aug': 7, 'august': 7,
      'sep': 8, 'september': 8, 
      'oct': 9, 'october': 9,
      'nov': 10, 'november': 10, 
      'dec': 11, 'december': 11
    };
    
    const monthKey = monthStr.toLowerCase().substring(0, 3);
    const monthIndex = months[monthKey];
    
    if (monthIndex !== undefined) {
      const year = parseInt(yearStr);
      if (!isNaN(year)) {
        if (monthIndex === 11) {
          return new Date(year, monthIndex, 31);
        } else {
          return new Date(year, monthIndex + 1, 0);
        }
      }
    }
    
    return null;
  };
  
  const tryParseDateMatch = (match) => {
    if (!match || match.length < 3) return null;
  
    const a = parseInt(match[1]);
    const b = parseInt(match[2]);
  
    if (match.length === 3) {
      if (a > 12 && a >= 1000) {
        const year = a;
        const month = b - 1;
        if (month >= 0 && month < 12) {
          return new Date(year, month + 1, 0);
        }
      } else if (b >= 1000) {
        const month = a - 1;
        const year = b;
        if (month >= 0 && month < 12) {
          return new Date(year, month + 1, 0);
        }
      }
    } else if (match.length === 4) {
      const c = parseInt(match[3]);
  
      if (a > 1000) {
        return new Date(a, b - 1, c);
      } else if (c > 1000) {
        if (a > 12) {
          return new Date(c, b - 1, a);
        } else if (b > 12) {
          return new Date(c, a - 1, b);
        } else {
          return new Date(c, b - 1, a);
        }
      }
    }
  
    return null;
  };
  