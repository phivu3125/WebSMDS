export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-yellow-50">
      <div className="text-center">
        {/* Spinner bars */}
        <div className="flex justify-center space-x-2 mb-6">
          <div className="w-3 h-12 bg-gradient-to-t from-purple-600 to-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-12 bg-gradient-to-t from-purple-600 to-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-12 bg-gradient-to-t from-purple-600 to-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          <div className="w-3 h-12 bg-gradient-to-t from-purple-600 to-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-yellow-600 bg-clip-text text-transparent">
            Sắc Màu Di Sản
          </h2>
          <p className="text-gray-600 text-sm animate-pulse">Đang tải nội dung...</p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}