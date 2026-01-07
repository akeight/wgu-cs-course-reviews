import { useState, useEffect } from "react";
import { Clock, Star, ThumbsDown, ThumbsUp, TrendingUp } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { API_BASE_URL } from "../config/api";

export default function ReviewCard({ review }) {
  const [userVote, setUserVote] = useState(null);
  const [voteLoading, setVoteLoading] = useState(false);
  const [reviewData, setReviewData] = useState(review);

  // Sync review data with review prop when changed
  useEffect(() => {
    setReviewData(review);
  }, [review]);

  // Fetch user vote on mount
  useEffect(() => {
    const fetchUserVote = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/reviews/${review.id}/vote`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setUserVote(data.userVote);
        }
      } catch (error) {
        console.error('Error fetching user vote:', error);
      }
    };

    fetchUserVote();
  }, [review.id]);

  const handleVote = async (reviewId, type) => {
    if (voteLoading) return;

    setVoteLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ vote_type: type }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error('Vote error:', error);
        if (res.status === 401) {
          alert('Please log in to vote on reviews.');
        }
        return;
      }

      const data = await res.json();
      setUserVote(data.userVote);
      setReviewData(data.review);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setVoteLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty <= 2) return "bg-green-100 text-green-800";
    if (difficulty <= 3) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={review.avatar} />
            <AvatarFallback>{review.username[0] + review.username[1]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                {/* need to fix userName */}
                <h4>{review.username}</h4>
                {/* <h4>Test User</h4> */}
                <p className="text-sm text-muted-foreground">
                  Posted on{" "}
                  {new Date(review.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Badge className={getDifficultyColor(review.difficulty)}>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> Difficulty:{" "}
                  {review.difficulty}/5
                </span>
              </Badge>
              <Badge variant="outline">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {review.hours_per_week}hr/week
                </span>
              </Badge>
            </div>

            <p className="text-muted-foreground">
              {review.review_text}
            </p>

            {/* Disabling tips for now */}
            {
              /* {review.tips && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm">
                            <span className="text-blue-900">💡 Tip: </span>
                            {review.tips}
                          </p>
                        </div>
                      )}  */
            }

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant={userVote === "up" ? "default" : "outline"}
                  size="sm"
                  className="gap-1"
                  onClick={() => handleVote(review.id, "up")}
                  disabled={voteLoading}
                >
                  <ThumbsUp className="w-4 h-4" />
                  {reviewData.upvotes}
                </Button>
                <Button
                  variant={userVote === "down" ? "default" : "outline"}
                  size="sm"
                  className="gap-1"
                  onClick={() => handleVote(review.id, "down")}
                  disabled={voteLoading}
                >
                  <ThumbsDown className="w-4 h-4" />
                  {reviewData.downvotes}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {reviewData.upvotes} {reviewData.upvotes === 1 ? 'person' : 'people'} found this helpful
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
