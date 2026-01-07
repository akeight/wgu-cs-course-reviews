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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { API_BASE_URL } from '../config/api'

export default function AddReviewModal({ courses, onReviewAdded }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="hover:cursor-pointer">
          <PlusIcon className="w-4 h-4" /> Add Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Submit a Course Review</DialogTitle>
          <DialogDescription>
            Share your experience to help fellow WGU students
          </DialogDescription>
        </DialogHeader>
        <AddReviewForm
          courses={courses}
          onClose={() => setOpen(false)}
          onReviewAdded={onReviewAdded}
        />
      </DialogContent>
    </Dialog>
  )
}

function AddReviewForm({ courses, onClose, onReviewAdded }) {

  const [selectedCourse, setSelectedCourse] = useState(
    courses?.[0]?.id ? String(courses[0].id) : ''
  )

  const [ratingValue, setRatingValue] = useState(2.5)
  const [difficulty, setDifficulty] = useState('2')
  const [timeSpent, setTimeSpent] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    if (!selectedCourse) {
      const errorMsg = 'Please select a course.'
      setError(errorMsg)
      toast.error(errorMsg)
      return
    }
    if (!reviewText.trim()) {
      const errorMsg = 'Please enter your review.'
      setError(errorMsg)
      toast.error(errorMsg)
      return
    }

    const hoursValue = timeSpent === '' ? 5 : Number(timeSpent)
    if (hoursValue > 168) {
      const errorMsg = 'Time spent cannot exceed 168 hours per week.'
      setError(errorMsg)
      toast.error(errorMsg)
      return
    }

    try {
      setSubmitting(true)
      const res = await fetch(`${API_BASE_URL}/api/courses/${selectedCourse}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          rating: Number(ratingValue),
          difficulty: Number(difficulty),
          hours_per_week: timeSpent === '' ? 5 : Number(timeSpent),
          review_text: reviewText.trim(),
        }),
      })

      if (res.status === 401) {
        const errorMsg = 'Please sign in to submit a review.'
        setError(errorMsg)
        toast.error(errorMsg)
        return
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Failed to submit review')
      }

      const newReview = await res.json()
      onReviewAdded && onReviewAdded(newReview)
      toast.success('Review submitted successfully')

      // reset and close
      setReviewText('')
      setTimeSpent('')
      setDifficulty('2')
      setRatingValue(2.5)
      onClose && onClose()
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
        <Label>Select Course</Label>
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a course..." />
          </SelectTrigger>
          <SelectContent className="overflow-y-auto max-h-80">
            <SelectGroup>
              {courses.map(course => (
                <SelectItem key={course.id} value={String(course.id)}>
                  {course.code} - {course.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3">
        <Label htmlFor="rating">Your Rating: {ratingValue}</Label>
        <p className="text-xs text-muted-foreground">1 = Terrible, 5 = Amazing</p>
        <div className="flex gap-2">
          <Slider
            value={[ratingValue]}
            min={1}
            max={5}
            step={0.5}
            onValueChange={vals => setRatingValue(vals[0])}
          />
        </div>
      </div>

      <div className="grid gap-3">
        <Label htmlFor="difficulty">Overall Difficulty</Label>
        <RadioGroup value={difficulty} onValueChange={setDifficulty}>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="1" id="1" />
            <Label htmlFor="1">Easy</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="2" id="2" />
            <Label htmlFor="2">Moderate</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="3" id="3" />
            <Label htmlFor="3">Hard</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid gap-3">
        <Label htmlFor="timeSpent">Time Spent Per Week (hours)</Label>
        <Input
          id="timeSpent"
          type="number"
          min="0"
          max="168"
          step="1"
          placeholder="10"
          value={timeSpent}
          onChange={e => setTimeSpent(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">Maximum 168 hours per week</p>
      </div>

      <div className="grid gap-3">
        <Label htmlFor="review">Your Review</Label>
        <Textarea
          placeholder="Share your experience or any tips for this course..."
          value={reviewText}
          onChange={e => setReviewText(e.target.value)}
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button
        type="submit"
        disabled={submitting || !selectedCourse || !reviewText}
        className="hover:cursor-pointer m-auto sm:min-w-[400px]"
      >
        {submitting ? 'Submitting…' : 'Submit Review'}
      </Button>
    </form>
  )
}
