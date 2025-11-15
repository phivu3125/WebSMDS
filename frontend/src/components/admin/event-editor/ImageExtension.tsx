import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import React, { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { SingleImageUpload } from '@/components/admin/reusable-image-upload'
import { X } from 'lucide-react'


const ImageComponent = ({ node, updateAttributes, deleteNode }: any) => {
  const imgRef = useRef<HTMLImageElement>(null)

  const handleImageChange = (value: string | File | undefined) => {
    if (!value) {
      deleteNode()
      return
    }

    if (typeof value === 'string') {
      updateAttributes({ src: value })
    } else if (value instanceof File) {
      // Create object URL for immediate preview
      const objectUrl = URL.createObjectURL(value)
      updateAttributes({ src: objectUrl, _file: value })
    }
  }

  if (!node.attrs.src) {
    return (
      <NodeViewWrapper className="image-placeholder">
        <div className="my-3">
          <SingleImageUpload
            value={undefined}
            onChange={handleImageChange}
            label="Thêm hình ảnh vào nội dung"
            placeholder="Chọn hoặc kéo thả hình ảnh"
            size="lg"
          />
          <div className="mt-2 flex justify-center">
            <Button
              onClick={() => deleteNode()}
              variant="outline"
              size="sm"
              className="text-gray-500"
            >
              <X className="h-4 w-4 mr-1" />
              Hủy
            </Button>
          </div>
        </div>
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper className="image-wrapper">
      <div
        className="my-3 relative group"
        style={{
          width: node.attrs.width || '100%',
          margin: '0.75rem auto',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          backgroundColor: '#f8f9fa',
          display: 'block'
        }}
      >
        <img
          ref={imgRef}
          src={node.attrs.src}
          alt={node.attrs.alt}
          title={node.attrs.title}
          className="pointer-events-none select-none"
          draggable={false}
          style={{
            width: '100%',
            height: node.attrs.height || 'auto',
            objectFit: 'cover',
            backgroundColor: '#f8f9fa',
            display: 'block'
          }}
        />

        {/* Edit controls */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white rounded-md shadow-lg border p-1 flex gap-1">
            <Button
              onClick={() => {
                updateAttributes({ width: '50%', height: 'auto' })
              }}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 px-2 text-xs font-medium"
              title="Nhỏ (50%)"
            >
              50%
            </Button>
            <Button
              onClick={() => {
                updateAttributes({ width: '75%', height: 'auto' })
              }}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 px-2 text-xs font-medium"
              title="Vừa (75%)"
            >
              75%
            </Button>
            <Button
              onClick={() => {
                updateAttributes({ width: '100%', height: 'auto' })
              }}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 px-2 text-xs font-medium"
              title="Lớn (100%)"
            >
              100%
            </Button>
            <Button
              onClick={() => deleteNode()}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              title="Xóa ảnh"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  )
}

export const CustomImage = Node.create({
  name: 'customImage',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: null,
      },
      height: {
        default: null,
      },
      align: {
        default: 'center',
        rendered: false,
      },
      _file: {
        default: null,
        rendered: false, // Don't render file attribute in HTML
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent)
  },

})