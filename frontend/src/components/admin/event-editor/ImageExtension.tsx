import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SingleImageUpload } from '@/components/admin/reusable-image-upload'
import { X, Edit } from 'lucide-react'

interface ImageAttributes {
  src: string
  alt?: string
  title?: string
  width?: number
  height?: number
  align?: 'left' | 'center' | 'right'
}

const ImageComponent = ({ node, updateAttributes, deleteNode }: any) => {
  const [isEditing, setIsEditing] = useState(false)
  const [tempAlt, setTempAlt] = useState(node.attrs.alt || '')
  const [tempTitle, setTempTitle] = useState(node.attrs.title || '')

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

  const handleSaveMetadata = () => {
    updateAttributes({
      alt: tempAlt,
      title: tempTitle
    })
    setIsEditing(false)
  }

  if (!node.attrs.src) {
    return (
      <NodeViewWrapper className="image-placeholder">
        <div className="my-4">
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

  if (isEditing) {
    return (
      <NodeViewWrapper className="image-editor">
        <div className="border rounded-lg p-4 bg-gray-50 my-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Alt Text</label>
              <Input
                value={tempAlt}
                onChange={(e) => setTempAlt(e.target.value)}
                placeholder="Mô tả hình ảnh"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                placeholder="Tiêu đề hình ảnh"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveMetadata} size="sm">
                Lưu
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                size="sm"
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper className="image-wrapper">
      <div className="group relative inline-block my-4">
        <img
          src={node.attrs.src}
          alt={node.attrs.alt}
          title={node.attrs.title}
          className="max-w-full h-auto rounded-lg shadow-md"
          style={{
            float: node.attrs.align === 'left' ? 'left' : node.attrs.align === 'right' ? 'right' : 'none',
            marginLeft: node.attrs.align === 'right' ? '1rem' : node.attrs.align === 'center' ? 'auto' : '0',
            marginRight: node.attrs.align === 'left' ? '1rem' : node.attrs.align === 'center' ? 'auto' : '0',
            display: node.attrs.align === 'center' ? 'block' : 'inline'
          }}
        />

        {/* Edit controls */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white rounded-md shadow-lg border p-1 flex gap-1">
            <Button
              onClick={() => setIsEditing(true)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Chỉnh sửa thông tin ảnh"
            >
              <Edit className="h-4 w-4" />
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

  addCommands() {
    return {
      setCustomImage: (options: ImageAttributes) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },
})