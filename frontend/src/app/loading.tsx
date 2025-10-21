// src/app/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>  {/* Spinner đơn giản */}
      <p className="ml-4 text-xl">Đang tải...</p>
    </div>
  );
}