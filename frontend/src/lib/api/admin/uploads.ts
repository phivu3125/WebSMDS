import { adminApiFetch, handleAdminResponse } from "./base"

interface UploadResponse {
  data: {
    url: string
  }
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await adminApiFetch("uploads/images", {
    method: "POST",
    body: formData
    // Note: Don't set Content-Type header for FormData, browser will set it with boundary
  })

  const data = await handleAdminResponse<UploadResponse>(response)
  return data.data.url
}

export async function deleteImage(filename: string): Promise<{ message: string }> {
  const response = await adminApiFetch(`uploads/images/${filename}`, {
    method: "DELETE"
  })
  return handleAdminResponse<{ message: string }>(response)
}
