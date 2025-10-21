// src/app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h2 className="text-4xl font-bold mb-4">404 - Không tìm thấy trang!</h2>
      <p className="mb-8 text-gray-600">Trang bạn tìm không tồn tại.</p>
      <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Về trang chủ
      </Link>
    </div>
  );
}