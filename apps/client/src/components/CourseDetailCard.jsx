import { Star, Clock } from 'lucide-react'
import { Badge } from './ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from './ui/card'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'

export default function CourseDetailCard({ courseInfo }) {
  const course = courseInfo

  const getProjectColor = has_project => {
    if (has_project) return 'bg-green-100 text-green-800'
    return 'bg-yellow-100 text-yellow-800'
  }

  const getProjectLabel = has_project => {
    if (has_project) return 'PA'
    return 'OA'
  }

  if (!course) {
    return (
      <>
        <Card className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <CardHeader className="flex flex-col items-center justify-center">
            <CardTitle>Course not found!</CardTitle>
            <CardDescription>
              The course you are looking for does not exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link to="/courses">Go back</Link>
            </Button>
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <>
      {/* Course Header */}
      <Card className="bg-white rounded-lg shadow-sm border p-8 mb-8">
        <CardHeader className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle>{course.code}</CardTitle>
              <Badge variant="secondary">{course.credits} Credit Units</Badge>
              <Badge className={getProjectColor(course.has_project)}>
                {getProjectLabel(course.has_project)}
              </Badge>
            </div>
            <CardDescription className="text-lg font-bold">
              {course.name}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="text-muted-foreground mb-6">
          <p className="text-base text-gray-600">{course.description}</p>
        </CardContent>

        {/* Quick Stats */}
        <CardContent className="grid grid-cols-4 gap-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Average Rating</p>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-2xl">
                {course.averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">/ 5.0</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Reviews</p>
            <div className="text-2xl">{course.totalReviews}</div>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Avg. Difficulty</p>
            <div className="text-2xl">
              {course.averageDifficulty.toFixed(1)} / 5
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Time per Week</p>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <span className="text-2xl">~{course.averageTimePerWeek}h</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
