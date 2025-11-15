'use client'

import { useState } from 'react'
import { deleteProductAction } from '@/lib/actions/product.actions'
import { Button } from '@/components/ui/Button'

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return
    }

    setIsDeleting(true)
    const result = await deleteProductAction(id)
    
    if (result.error) {
      alert(result.error)
      setIsDeleting(false)
    }
    // On success, the page will revalidate automatically
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
