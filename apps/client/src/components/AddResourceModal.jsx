import { cn } from '@/lib/utils'
import { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { API_BASE_URL } from '../config/api'

export default function AddResourceModal({ courses, onResourceAdded }) {
   const [open, setOpen] = useState(false)
   const courseId = courses[0].id

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="hover:cursor-pointer">
          <PlusIcon className="w-4 h-4" /> Add Resource
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Submit a Course Resource</DialogTitle>
          <DialogDescription>
            Share a helpful resource for this course. Provide a short description and the URL.
          </DialogDescription>
        </DialogHeader>
        <AddResourceForm courseId={courseId} onResourceAdded={onResourceAdded} onClose={() => setOpen(false)}  />
      </DialogContent>
    </Dialog>
  )
}

function AddResourceForm({ courseId, onResourceAdded, onClose }) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      setSubmitting(true)
      setError('')

      const res = await fetch(`${API_BASE_URL}/api/courses/${courseId}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title: title.trim(), url: url.trim() }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.error || 'Failed to submit resource')
      }

      if (res) {
          const newResource = await res.json();
          onResourceAdded(newResource);
          toast.success('Resource submitted successfully')
      } 

      setTitle('')
      setUrl('')
      onClose()
    } catch (err) {
      const errorMessage = err.message || 'Something went wrong'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('grid items-start gap-6')}>
      <div className="grid gap-3">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="e.g., Big O Notation Cheat Sheet"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
      </div>

      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : null}

      <Button
        type="submit"
        disabled={submitting}
        className="hover:cursor-pointer m-auto sm:min-w-[400px]"
      >
        {submitting ? 'Submitting…' : 'Submit Resource'}
      </Button>
    </form>
  )
}
