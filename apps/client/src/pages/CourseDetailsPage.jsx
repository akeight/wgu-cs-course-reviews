import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import Header from "../components/Header";
import CourseDetailCard from "../components/CourseDetailCard";
import { useParams } from "react-router-dom";
import AddReviewModal from "../components/AddReviewModal";
import ReviewListing from "../components/ReviewListing";
import { useLocation } from "react-router-dom";
import ResourceListing from "../components/ResourceListing";
import AddResourceModal from "../components/AddResourceModal";
import CourseCardSkeleton from "../components/CourseCardSkeleton";
import { useEffect } from "react";
import { API_BASE_URL } from "../config/api";

export default function CourseDetailsPage() {
  const { courseId } = useParams();
  const location = useLocation();
  const [courseInfo, setCourseInfo] = useState(location.state || {});
  const [reviews, setReviews] = useState([]);
  const [resources, setResources] = useState([]);
  const [fetchingResources, setFetchingResources] = useState(false);

  // Calculate stats dynamically from current reviews
  const courseStats = {
    ...courseInfo,
    totalReviews: reviews.length,
    averageRating: reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length 
      : 0,
    averageDifficulty: reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + Number(r.difficulty || 0), 0) / reviews.length 
      : 0,
    averageTimePerWeek: reviews.length > 0 
      ? Math.round(reviews.reduce((sum, r) => sum + Number(r.hours_per_week || 0), 0) / reviews.length)
      : 0,
  };

  const handleResourceAdded = (newResource) => {
    if (!newResource) return;
    setResources((prev) => [newResource, ...prev]);
  };

  const fetchCourseReviews = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/courses/${courseId}/reviews`);
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.log(`error fetching course reviews: ${error}`);
    }
  };

  useEffect(() => {
    // Fetch course data if not available from location.state (e.g., direct URL or OAuth redirect)
    const fetchCourseData = async () => {
      if (!courseInfo.id || String(courseInfo.id) !== String(courseId)) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/courses/${courseId}`);
          const data = await res.json();
          setCourseInfo(data);
        } catch (error) {
          console.log(`error fetching course data: ${error}`);
        }
      }
    };

    const fetchCourseResources = async () => {
      try {
        setFetchingResources(true);
        const res = await fetch(`${API_BASE_URL}/api/courses/${courseId}/resources`);
        const data = await res.json();
        setResources(data);
      } catch (error) {
        console.log(`error fetching course resources: ${error}`);
      } finally {
        setFetchingResources(false);
      }
    };

    fetchCourseData();
    fetchCourseReviews();
    fetchCourseResources();
  }, [courseId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <CourseDetailCard courseInfo={courseStats} />

        {/* Tabs */}
        <Tabs defaultValue="reviews" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-sm">
            <TabsTrigger value="reviews">
              Reviews ({reviews.length})
            </TabsTrigger>
            <TabsTrigger value="resources">
              Resources {fetchingResources ? "" : `(${resources.length})`}
            </TabsTrigger>
          </TabsList>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3>Student Reviews</h3>
              <AddReviewModal 
                courses={[courseInfo]} 
                onReviewAdded={async () => {
                  // Refetch reviews to get updated vote counts
                  await fetchCourseReviews();
                }} 
              />
            </div>
            <ReviewListing reviews={reviews} />
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3>Student Resources</h3>
              <AddResourceModal courses={[courseInfo]} onResourceAdded={handleResourceAdded} />
            </div>
            {fetchingResources
              ? <CourseCardSkeleton />
              : <ResourceListing resources={resources} />}
          </TabsContent>
          {/* Stats Tab */}
        </Tabs>
      </main>
    </div>
  );
}
