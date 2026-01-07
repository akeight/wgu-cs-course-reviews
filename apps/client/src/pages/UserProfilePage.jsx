import { Star, Calendar, TrendingUp, Award, Edit, Trash2, Clock } from 'lucide-react';
import { ReviewSkeleton } from '../components/ReviewSkeleton';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Slider } from '../components/ui/slider';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Spinner } from '../components/ui/spinner';
import { API_BASE_URL } from '../config/api';

// Helper function to get initials from name
const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export default function UserProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [userResources, setUserResources] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [resourcesError, setResourcesError] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [editingResource, setEditingResource] = useState(null);
  const [deletingReview, setDeletingReview] = useState(null);
  const [deletingResource, setDeletingResource] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch courses for displaying course names
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/courses`);
        if (!res.ok) throw new Error('Failed to fetch courses');
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  // Fetch user reviews
  useEffect(() => {
    if (!user?.id) return;

    const fetchReviews = async () => {
      setReviewsLoading(true);
      setReviewsError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/${user.id}/reviews`);
        if (!res.ok) throw new Error('Failed to fetch reviews');
        const data = await res.json();
        setUserReviews(data || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviewsError(error.message);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [user?.id]);

  // Fetch user resources
  useEffect(() => {
    if (!user?.id) return;

    const fetchResources = async () => {
      setResourcesLoading(true);
      setResourcesError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/${user.id}/resources`);
        if (!res.ok) throw new Error('Failed to fetch resources');
        const data = await res.json();
        setUserResources(data || []);
      } catch (error) {
        console.error('Error fetching resources:', error);
        setResourcesError(error.message);
      } finally {
        setResourcesLoading(false);
      }
    };

    fetchResources();
  }, [user?.id]);

  // Calculate user stats from actual data
  const userStats = useMemo(() => {
    if (!userReviews || !userResources) {
      return {
        totalReviews: 0,
        totalUpvotes: 0,
        resourcesShared: 0,
        helpfulVotes: 0,
        coursesCompleted: 0,
        memberSince: 'Recently'
      };
    }

    const totalUpvotes = userReviews.reduce((sum, review) => sum + (review.upvotes || 0), 0);
    const totalDownvotes = userReviews.reduce((sum, review) => sum + (review.downvotes || 0), 0);
    const helpfulVotes = totalUpvotes - totalDownvotes;

    return {
      totalReviews: userReviews.length,
      totalUpvotes,
      resourcesShared: userResources.length,
      helpfulVotes: Math.max(0, helpfulVotes),
      coursesCompleted: new Set(userReviews.map(r => r.course_id)).size,
      memberSince: user?.created_at 
        ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Recently'
    };
  }, [userReviews, userResources, user]);

  // Handle course click
  const onCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  // Get difficulty color classes
  const getDifficultyColor = (difficulty) => {
    if (difficulty <= 2) return "bg-green-100 text-green-800";
    if (difficulty <= 3) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  // Handle delete review
  const handleDeleteReview = async (reviewId) => {
    setDeletingReview(reviewId);
  };

  const confirmDeleteReview = async () => {
    if (!deletingReview) return;

    try {
      setDeleting(true);
      const res = await fetch(`${API_BASE_URL}/api/reviews/${deletingReview}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || 'Failed to delete review');
      }

      setUserReviews(prev => prev.filter(r => r.id !== deletingReview));
      setDeletingReview(null);
      toast.success('Review deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete review');
    } finally {
      setDeleting(false);
    }
  };

  // Handle edit review
  const handleUpdateReview = async (reviewId, updatedData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || 'Failed to update review');
      }

      const updatedReview = await res.json();
      setUserReviews(prev => prev.map(r => r.id === reviewId ? updatedReview : r));
      setEditingReview(null);
      toast.success('Review updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update review');
    }
  };

  // Handle delete resource
  const handleDeleteResource = async (resourceId) => {
    setDeletingResource(resourceId);
  };

  const confirmDeleteResource = async () => {
    if (!deletingResource) return;

    try {
      setDeleting(true);
      const res = await fetch(`${API_BASE_URL}/api/resources/${deletingResource}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || 'Failed to delete resource');
      }

      setUserResources(prev => prev.filter(r => r.id !== deletingResource));
      setDeletingResource(null);
      toast.success('Resource deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete resource');
    } finally {
      setDeleting(false);
    }
  };

  // Handle edit resource
  const handleUpdateResource = async (resourceId, updatedData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/resources/${resourceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || 'Failed to update resource');
      }

      const updatedResource = await res.json();
      setUserResources(prev => prev.map(r => r.id === resourceId ? updatedResource : r));
      setEditingResource(null);
      toast.success('Resource updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update resource');
    }
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 grid place-items-center min-h-[35vh]">
          {/* <div className="text-center">Loading...</div> */}
          <Spinner className="w-32 h-32" />

        </main>
      </div>
    );
  }

  // Show error if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Card>
              <CardContent>
                <p>Please log in to view your profile.</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Get user display info from GitHub profile
  const displayName = user.displayName || user.username || 'User';
  const username = user.username || 'user';
  const avatarUrl = user.avatar || null;
  const initials = getInitials(displayName);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-card rounded-lg shadow-sm border p-8 mb-8">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h1 className="text-2xl font-bold">{displayName}</h1>
                  <p className="text-muted-foreground">@{username}</p>
                </div>
              </div>
              <div className="flex gap-2 mb-4">
                {userStats.totalReviews > 4 && (
                  <Badge variant="secondary" className="gap-1">
                    <Award className="w-4 h-4" />
                    Reviewer Extraordinaire
                  </Badge>
                )}
              </div>
              <div className="flex gap-2 mb-4">
                {userStats.helpfulVotes > 3 && (
                  <Badge variant="secondary" className="gap-1">
                    <Award className="w-4 h-4" />
                    Helpful Helper
                  </Badge>
                )}
              </div>
              <div className="flex gap-2 mb-4">
                {userStats.resourcesShared > 3 && (
                  <Badge variant="secondary" className="gap-1">
                    <Award className="w-4 h-4" />
                    Resource Maven
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Joined {userStats.memberSince}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Reviews Written</p>
                  <p className="text-3xl">{userStats.totalReviews}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Upvotes</p>
                  <p className="text-3xl">{userStats.totalUpvotes}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Resources Shared</p>
                  <p className="text-3xl">{userStats.resourcesShared}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Tabs */}
        <Tabs defaultValue="reviews" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="reviews">My Reviews</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          {/* My Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">Your Course Reviews</h3>
                <p className="text-sm text-muted-foreground">
                  {userStats.totalReviews} reviews written
                </p>
              </div>
            </div>

            {reviewsLoading && (
              <ReviewSkeleton />
            )}

            {reviewsError && (
              <div className="text-center py-8 text-red-500">
                Error loading reviews: {reviewsError}
              </div>
            )}

            {!reviewsLoading && !reviewsError && userReviews.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">You haven't written any reviews yet.</p>
                </CardContent>
              </Card>
            )}

            {!reviewsLoading && !reviewsError && userReviews.map(review => {
              const course = courses.find(c => c.id === review.course_id);
              if (!course) return null;

              return (
                <Card 
                  key={review.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 
                            className="font-semibold cursor-pointer hover:text-blue-600"
                            onClick={() => onCourseClick(review.course_id)}
                          >
                            {course.title}
                          </h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Reviewed on {new Date(review.created_at).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingReview(review);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteReview(review.id);
                          }}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-3">
                      {review.review_text}
                    </p>

                    <div className="flex items-center gap-4 text-sm">
                      <Badge className={getDifficultyColor(review.difficulty)}>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" /> Difficulty: {review.difficulty}/5
                        </span>
                      </Badge>
                      <Badge variant="outline">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {review.hours_per_week}hr/week
                        </span>
                      </Badge>
                      <Separator orientation="vertical" className="h-4" />
                      <span className="text-muted-foreground">
                        {review.upvotes} upvotes
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">Resources You've Shared</h3>
                <p className="text-sm text-muted-foreground">
                  {userStats.resourcesShared} resources contributed
                </p>
              </div>
            </div>

            {resourcesLoading && (
              <ReviewSkeleton />
            )}

            {resourcesError && (
              <div className="text-center py-8 text-red-500">
                Error loading resources: {resourcesError}
              </div>
            )}

            {!resourcesLoading && !resourcesError && userResources.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">You haven't shared any resources yet.</p>
                </CardContent>
              </Card>
            )}

            {!resourcesLoading && !resourcesError && userResources.map(resource => {
              const course = courses.find(c => c.id === resource.course_id);
              if (!course) return null;

              return (
                <Card key={resource.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{resource.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          For {course.title}
                        </p>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {resource.url}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingResource(resource);
                          }}
                        >
                          <Edit className="h-6 w-6" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteResource(resource.id);
                          }}
                        >
                          <Trash2 className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Your Learning Journey</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Program Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Courses Reviewed</span>
                        <span>{userStats.coursesCompleted}</span>
                      </div>
                      <Progress value={Math.min(100, (userStats.coursesCompleted / 36) * 100)} />
                    </div>

                    <Separator />

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Reviews Written</span>
                        <span>{userStats.totalReviews}</span>
                      </div>
                      <Progress value={Math.min(100, userStats.totalReviews * 10)} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Community Impact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm">Total Upvotes</span>
                      <span>{userStats.totalUpvotes}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm">Resources Shared</span>
                      <span>{userStats.resourcesShared}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Review Modal */}
      {editingReview && (
        <EditReviewModal
          review={editingReview}
          onClose={() => setEditingReview(null)}
          onUpdate={handleUpdateReview}
        />
      )}

      {/* Edit Resource Modal */}
      {editingResource && (
        <EditResourceModal
          resource={editingResource}
          onClose={() => setEditingResource(null)}
          onUpdate={handleUpdateResource}
        />
      )}

      {/* Delete Review Confirmation Modal */}
      {deletingReview && (
        <DeleteConfirmationModal
          title="Delete Review"
          description="Are you sure you want to delete this review? This action cannot be undone."
          onConfirm={confirmDeleteReview}
          onCancel={() => setDeletingReview(null)}
          deleting={deleting}
        />
      )}

      {/* Delete Resource Confirmation Modal */}
      {deletingResource && (
        <DeleteConfirmationModal
          title="Delete Resource"
          description="Are you sure you want to delete this resource? This action cannot be undone."
          onConfirm={confirmDeleteResource}
          onCancel={() => setDeletingResource(null)}
          deleting={deleting}
        />
      )}
    </div>
  );
}

// Delete Confirmation Modal Component
function DeleteConfirmationModal({ title, description, onConfirm, onCancel, deleting }) {
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Edit Review Modal Component
function EditReviewModal({ review, onClose, onUpdate }) {
  const [ratingValue, setRatingValue] = useState(review.rating);
  const [difficulty, setDifficulty] = useState(String(review.difficulty));
  const [timeSpent, setTimeSpent] = useState(String(review.hours_per_week));
  const [reviewText, setReviewText] = useState(review.review_text);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!reviewText.trim()) {
      setError('Please enter your review.');
      return;
    }

    try {
      setSubmitting(true);
      await onUpdate(review.id, {
        rating: Number(ratingValue),
        difficulty: Number(difficulty),
        hours_per_week: Number(timeSpent),
        review_text: reviewText.trim(),
      });
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
          <DialogDescription>
            Update your review details
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid items-start gap-6">
          <div className="grid gap-3">
            <Label htmlFor="rating">Your Rating: {ratingValue}</Label>
            <p className="text-xs text-muted-foreground">1 = Terrible, 5 = Amazing</p>
            <Slider
              value={[ratingValue]}
              min={1}
              max={5}
              step={0.5}
              onValueChange={vals => setRatingValue(vals[0])}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="difficulty">Overall Difficulty</Label>
            <RadioGroup value={difficulty} onValueChange={setDifficulty}>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="1" id="edit-1" />
                <Label htmlFor="edit-1">Easy</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="2" id="edit-2" />
                <Label htmlFor="edit-2">Moderate</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="3" id="edit-3" />
                <Label htmlFor="edit-3">Hard</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="timeSpent">Time Spent Per Week (hours)</Label>
            <Input
              id="timeSpent"
              type="number"
              min="0"
              step="1"
              value={timeSpent}
              onChange={e => setTimeSpent(e.target.value)}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="review">Your Review</Label>
            <Textarea
              placeholder="Share your experience or any tips for this course..."
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !reviewText}>
              {submitting ? 'Updating…' : 'Update Review'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Edit Resource Modal Component
function EditResourceModal({ resource, onClose, onUpdate }) {
  const [title, setTitle] = useState(resource.title);
  const [url, setUrl] = useState(resource.url);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !url.trim()) {
      setError('Title and URL are required.');
      return;
    }

    try {
      setSubmitting(true);
      await onUpdate(resource.id, {
        title: title.trim(),
        url: url.trim(),
      });
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Edit Resource</DialogTitle>
          <DialogDescription>
            Update your resource details
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid items-start gap-6">
          <div className="grid gap-3">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              placeholder="e.g., Big O Notation Cheat Sheet"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="edit-url">URL</Label>
            <Input
              id="edit-url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !title || !url}>
              {submitting ? 'Updating…' : 'Update Resource'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
