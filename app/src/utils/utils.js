const formatStrToNoSpecialChars = (str) => {
  return str.replace(/[^\w\s.]/gi, '');
};

  const truncateFileName = (filename, maxLength = 25) => {
    if (filename.length <= maxLength) return filename;
  
    const ext = filename.slice(filename.lastIndexOf('.'));
    const nameWithoutExt = filename.slice(0, filename.lastIndexOf('.'));
    const truncatedName = nameWithoutExt.slice(0, maxLength - ext.length);
  
    return truncatedName + ext;
  };
  
  export { formatStrToNoSpecialChars, truncateFileName };
  