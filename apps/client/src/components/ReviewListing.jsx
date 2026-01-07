import ReviewCard from './ReviewCard';

function ReviewListing({ reviews }) {

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No reviews yet. Be the first to review this course!</p>
      </div>
    );
  }

  return (
  
    <div className="flex flex-col gap-6">
      {reviews.map((review) => (
        <ReviewCard 
          key={review.id} 
          review={review}
          // votedReviews={votedReviews}
          // handleVote={handleVote}
          />
      ))}
    </div>
    
  );
}

export default ReviewListing;