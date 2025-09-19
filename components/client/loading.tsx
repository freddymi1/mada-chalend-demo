export const LoadingSpinner = () => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center">
      {/* Spinner */}
      <div className="relative">
        {/* Outer ring */}
        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
        {/* Inner pulse dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
      </div>
      
      {/* <div className="mt-4 font-medium animate-pulse">
        Loading...
      </div>
      
      <div className="flex space-x-1 mt-2">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
      </div> */}
    </div>
  );
};