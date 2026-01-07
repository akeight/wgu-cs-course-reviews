import { Star, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Badge } from './ui/badge'

export default function CourseCard({ course, onClick }) {
  const [isLoading, setIsLoading] = useState(true)

  const getDifficultyColor = difficulty => {
    if (difficulty < 2.5) return 'bg-green-100 text-green-800'
    if (difficulty < 3.5) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getDifficultyLabel = difficulty => {
    if (difficulty < 2.5) return 'Easy'
    if (difficulty < 3.5) return 'Moderate'
    if (difficulty < 4.5) return 'Hard'
    return 'Very Hard'
  }


  return (
    <Card
      className="cursor-pointer max-w-sm transform-gpu transition duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-lg"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between mb-0">
          <div>
            <CardTitle>{course.code}</CardTitle>
           
          </div>
          <Badge variant="secondary">{course.credits} CUs</Badge>
        </div>
         <CardDescription className="">{course.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-5">{course.description}</p>

        <div className="flex justify-around gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{course.averageRating.toFixed(1)}</span>
            <span className="text-gray-500">({course.totalReviews})</span>
          </div>

          <div className="flex items-center gap-1">
            <Badge className={getDifficultyColor(course.averageDifficulty)}>
              {getDifficultyLabel(course.averageDifficulty)}
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">
              {course.averageTimePerWeek}h/week
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
