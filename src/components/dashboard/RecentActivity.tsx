
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { StudentCreation } from '@/types/teacher';

interface RecentActivityProps {
  creations: StudentCreation[];
}

export function RecentActivity({ creations }: RecentActivityProps) {
  const recent = creations.slice(0, 5);

  const getCreationIcon = (type: string) => {
    switch (type) {
      case 'image': return '🎨';
      case 'music': return '🎵';
      case 'story': return '📚';
      default: return '✨';
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recent.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No recent activity to display
          </p>
        ) : (
          recent.map((creation) => (
            <div key={creation.id} className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={creation.username} alt={creation.username} />
                <AvatarFallback>
                  {creation.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {creation.username}
                </p>
                <p className="text-xs text-muted-foreground">
                  {creation.class_name}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className={getCreationColor(creation.creation_type)}>
                  {getCreationIcon(creation.creation_type)} {creation.creation_type}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(creation.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
