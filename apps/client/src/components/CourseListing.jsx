// import { useState, useEffect } from 'react'
import CourseCard from './CourseCard'
// import CourseCardSkeleton from './CourseCardSkeleton'
function CourseListing({ courses, onCourseClick }) {
  // const [isLoading, setIsLoading] = useState(true)

  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsLoading(false)
  //   }, 1000)
  // }, [])
  // if (isLoading) {
  //   return <CourseCardSkeleton />
  // }
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(course => (
        <CourseCard
          key={course.id}
          course={course}
          onClick={() => onCourseClick(course.id)}
        />
      ))}
    </div>
  )
}

export default CourseListing
