
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Image, Music, BookOpen, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { StudentCreation } from '@/types/teacher';
import { memo } from 'react';

interface CreationCardProps {
  creation: StudentCreation;
}

const getCreationIcon = (type: string) => {
  switch (type) {
    case 'image': return Image;
    case 'music': return Music;
    case 'story': return BookOpen;
    default: return Eye;
  }
};

const getCreationColor = (type: string) => {
  switch (type) {
    case 'image': return 'bg-blue-100 text-blue-800';
    case 'music': return 'bg-purple-100 text-purple-800';
    case 'story': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const CreationPreview = memo(({ creation }: { creation: StudentCreation }) => {
  if (creation.creation_type === 'image' && creation.creation_data?.image_url) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
        <img 
          src={creation.creation_data.image_url} 
          alt="Student creation"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }
  
  if (creation.creation_type === 'music' && creation.creation_data?.audio_url) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <audio controls className="w-full" preload="none">
          <source src={creation.creation_data.audio_url} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }
  
  if (creation.creation_type === 'story' && creation.creation_data?.content) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg p-4 overflow-auto">
        <p className="text-sm line-clamp-6">
          {creation.creation_data.content}
        </p>
      </div>
    );
  }

  return (
    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-muted-foreground">Preview not available</p>
    </div>
  );
});

CreationPreview.displayName = 'CreationPreview';

export const CreationCard = memo(({ creation }: CreationCardProps) => {
  const IconComponent = getCreationIcon(creation.creation_type);
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={creation.username} alt={creation.username} />
              <AvatarFallback>
                {creation.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm">{creation.username}</CardTitle>
              <p className="text-xs text-muted-foreground">{creation.class_name}</p>
            </div>
          </div>
          <Badge className={getCreationColor(creation.creation_type)}>
            <IconComponent className="w-3 h-3 mr-1" />
            {creation.creation_type}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <CreationPreview creation={creation} />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDistanceToNow(new Date(creation.created_at), { addSuffix: true })}
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Creation Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={creation.username} alt={creation.username} />
                    <AvatarFallback>
                      {creation.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{creation.username}</p>
                    <p className="text-sm text-muted-foreground">{creation.class_name}</p>
                  </div>
                  <Badge className={getCreationColor(creation.creation_type)}>
                    <IconComponent className="w-3 h-3 mr-1" />
                    {creation.creation_type}
                  </Badge>
                </div>
                
                <CreationPreview creation={creation} />
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Created: {new Date(creation.created_at).toLocaleString()}
                  </p>
                  {creation.creation_data?.title && (
                    <p className="text-sm">
                      <span className="font-medium">Title:</span> {creation.creation_data.title}
                    </p>
                  )}
                  {creation.creation_data?.prompt && (
                    <p className="text-sm">
                      <span className="font-medium">Prompt:</span> {creation.creation_data.prompt}
                    </p>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
});

CreationCard.displayName = 'CreationCard';
