'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { deleteCategory } from '@/lib/actions/category.actions'

export function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return
    }

    setIsDeleting(true)
    try {
      const result = await deleteCategory(id)
      
      if (result.ok) {
        router.refresh()
      } else {
        if (result.data.error === 'CATEGORY_IN_USE') {
          alert(`Cannot delete: ${result.data.details?.message || 'Category is in use'}`)
        } else {
          alert(`Failed to delete: ${result.data.error}`)
        }
      }
    } catch (error) {
      alert('Failed to delete category')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      variant="danger"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </Button>
  )
}
