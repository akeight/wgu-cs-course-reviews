import { SlidersHorizontal } from 'lucide-react'
import { Slider } from './ui/slider'
import { Badge } from './ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export default function FilterCoursesModal({
  difficultyFilter,
  onDifficultyChange,
  ratingFilter,
  onRatingChange,
  onFilterReset,
}) {
  // const filterIsActive =
  //   difficultyFilter !== '' || ratingFilter[0] !== 1 || ratingFilter[1] !== 5

     const filterIsActive = difficultyFilter !== '' || ratingFilter[0] !== 0 || ratingFilter[1] !== 5;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 hover:cursor-pointer">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {filterIsActive && (
            <Badge variant="secondary" className="ml-1">
              Active
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Courses</SheetTitle>
          <SheetDescription>
            Adjust difficulty and rating filters.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 mt-3">
          <div className="space-y-3">
            <Label htmlFor="difficulty">Overall Difficulty</Label>
            <RadioGroup
              className="mt-1"
              value={difficultyFilter}
              onValueChange={onDifficultyChange}
            >
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

          <div className="space-y-3">
            <Label>Rating Range</Label>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-muted-foreground w-8">
                {ratingFilter[0]}
              </span>
              <Slider
                value={ratingFilter}
                onValueChange={onRatingChange}
                min={0}
                max={5}
                step={0.5}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-8">
                {ratingFilter[1]}
              </span>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={onFilterReset}>
            Reset Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
