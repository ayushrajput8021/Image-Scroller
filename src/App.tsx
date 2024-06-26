// App.tsx
import './App.css';
import { useState, ChangeEvent } from 'react';
import * as XLSX from 'xlsx';

function App() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (!e.target?.result) return;

      const data = new Uint8Array(e.target.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });

      // Find the index of the "Image Src" column
      const headerRow = jsonData[0];
      const imageSrcIndex = headerRow.indexOf('Image Src');

      if (imageSrcIndex === -1) {
        alert("Column 'Image Src' not found in the Excel file");
        return;
      }

      // Extract the URLs from the "Image Src" column
      const urls = jsonData.slice(1).map(row => row[imageSrcIndex]).filter(url => url);
      setImageUrls(urls);
    };

    reader.readAsArrayBuffer(file);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1);
  };

  return (
    <div className='w-full h-screen p-4 bg-slate-500'>
      <div className='flex flex-col justify-center'>
        <h2 className='text-center text-2xl font-bold mb-4'>Image Carousel</h2>
        <input
          type='file'
          accept='.xlsx, .xls'
          onChange={handleFileUpload}
          className='block mx-auto mb-4 border rounded p-2'
        />
        {imageUrls.length > 0 && (
          <>
            <p>{imageUrls[currentIndex]}</p>
            <div className='flex justify-center items-center'>
              <button
                onClick={handlePrev}
                className='bg-gray-700 text-white rounded-full p-4'
              >
                &lt;
              </button>
              <img
                src={imageUrls[currentIndex]}
                alt={`Slide ${currentIndex}`}
                className='size-96 m-16 rounded-sm'
              />
              <button
                onClick={handleNext}
                className='bg-gray-700 text-white rounded-full p-4'
              >
                &gt;
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
