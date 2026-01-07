import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "../components/ui/input";
import Header from "../components/Header";
import CourseListing from "../components/CourseListing";
import AddReviewModal from "../components/AddReviewModal";
import FilterCoursesModal from "../components/FilterCoursesModal";
import CourseCardSkeleton from "../components/CourseCardSkeleton";
 import { API_BASE_URL } from '../config/api'

export default function AllCoursesPage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState([0, 5]);

  const fetchCoursesAndStats = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      // Fetch all courses with aggregated stats in ONE query
      // const res = await fetch("/api/courses?stats=true");
      const res = await fetch(`${API_BASE_URL}/api/courses?stats=true`, { credentials: 'include' })
      if (!res.ok) {
        console.error(`Failed to fetch courses: ${res.status}`);
        throw new Error(`Failed to fetch courses: ${res.status}`);
      }
      const coursesWithStats = await res.json();
      console.log('Fetched courses with stats:', coursesWithStats.length);
      
      // Map backend shape to UI shape expected by the cards/listing components
      const mappedCourses = coursesWithStats.map(course => ({
        id: String(course.id),
        code: course.course_code ?? `C${course.id}`,
        name: course.title,
        credits: course.credits,
        description: course.description ?? "",
        has_project: course.has_project,
        totalReviews: course.total_reviews || 0,
        averageRating: course.average_rating || 0,
        averageDifficulty: course.average_difficulty || 0,
        averageTimePerWeek: course.average_hours_per_week || 0,
      }));
      
      setCourses(mappedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      // Keep existing courses on error instead of clearing
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesAndStats();
  }, []);

  // use regex to search if a string has a digit in it
  const searchValueHasNumber = searchValue.search(/\d/);
  const searchedCourses = searchValueHasNumber === 1
    ? courses.filter((course) =>
      course.code.toLowerCase().includes(searchValue.toLowerCase().trim())
    )
    : courses.filter((course) =>
      course.name.toLowerCase().includes(searchValue.toLowerCase().trim())
    );

  const initialCourseCount = courses.length;

  // Apply filters
  const difficultyRange = (course) => {
    if (!difficultyFilter) return true;
    const courseDifficulty = course.averageDifficulty;
    switch (difficultyFilter) {
      case "1": // Easy
        return courseDifficulty < 2.5;
      case "2": // Moderate
        return courseDifficulty >= 2.5 && courseDifficulty < 3.5;
      case "3": // Hard
        return courseDifficulty >= 3.5;
      default:
        return true;
    }
  };
  const ratingRange = (course) => !course.totalReviews || (course.averageRating >= ratingFilter[0] && course.averageRating <= ratingFilter[1]);

  const visibleCourses = searchedCourses.filter((course) =>
    difficultyRange(course) && ratingRange(course)
  );

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`, {
      state: courses.find(c => String(c.id) === String(courseId))
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1>Browse Courses</h1>
          <p className="text-muted-foreground mt-2">
            {loading
              ? "Explore Computer Science courses with reviews from fellow WGU students"
              : `Explore ${initialCourseCount} Computer Science courses with reviews from fellow WGU students`}
          </p>
        </div>

        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search courses by name or code..."
                className="pl-10"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          <FilterCoursesModal
            difficultyFilter={difficultyFilter}
            onDifficultyChange={setDifficultyFilter}
            ratingFilter={ratingFilter}
            onRatingChange={setRatingFilter}
            onFilterReset={() => {
              setDifficultyFilter("");
              setRatingFilter([0, 5]);
            }}
          />
          <AddReviewModal
            courses={visibleCourses}
            onReviewAdded={async (newReview) => {
              console.log('Review added, refetching courses...', newReview);
              try {
                // Refetch all courses with updated stats (without showing loading spinner)
                await fetchCoursesAndStats(false);
                console.log('Courses refetched successfully');
              } catch (error) {
                console.error('Error refetching courses after review:', error);
              }
            }}
          />
        </div>

        {loading ? <CourseCardSkeleton /> : (
          <>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Showing {visibleCourses.length} of {initialCourseCount} courses
              </p>
            </div>
            <CourseListing
              courses={visibleCourses}
              onCourseClick={handleCourseClick}
            />
          </>
        )}
      </main>
    </div>
  );
}
