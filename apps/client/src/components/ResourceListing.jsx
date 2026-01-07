import ResourceCard from './ResourceCard';

function ResourceListing({ resources }) {

  if (!resources || resources.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No resources yet. Be the first to add a resource to this course!</p>
      </div>
    );
  }

  return (
  
    <div className="flex flex-col gap-6">
      {resources.map((resource) => (
        <ResourceCard 
          key={resource.id} 
          resource={resource}
          />
      ))}
    </div>
    
  );
}

export default ResourceListing;