
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useStudentCreations } from '@/hooks/useTeacherData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Calendar, Image, Music, BookOpen, Eye } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { StudentCreation } from '@/types/teacher';

export default function Creations() {
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('studentId') || undefined;
  const classId = searchParams.get('classId') || undefined;
  const { data: creations, isLoading } = useStudentCreations(studentId, classId);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const filteredAndSortedCreations = useMemo(() => {
    if (!creations) return [];

    let filtered = creations.filter(creation => 
      creation.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creation.class_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter by creation type
    if (filterType !== 'all') {
      filtered = filtered.filter(creation => creation.creation_type === filterType);
    }

    // Sort creations
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'student':
          return a.username.localeCompare(b.username);
        case 'type':
          return a.creation_type.localeCompare(b.creation_type);
        default:
          return 0;
      }
    });
  }, [creations, searchTerm, filterType, sortBy]);

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

  const CreationPreview = ({ creation }: { creation: StudentCreation }) => {
    if (creation.creation_type === 'image' && creation.creation_data?.image_url) {
      return (
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <img 
            src={creation.creation_data.image_url} 
            alt="Student creation"
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
    
    if (creation.creation_type === 'music' && creation.creation_data?.audio_url) {
      return (
        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
          <audio controls className="w-full">
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
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Creations</h1>
            <p className="text-muted-foreground">Explore student AI creations</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Creations</h1>
          <p className="text-muted-foreground">
            Explore student AI creations {studentId ? 'for this student' : classId ? 'from this class' : 'from all classes'}
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student or class..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="story">Stories</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="student">Student Name</SelectItem>
                  <SelectItem value="type">Creation Type</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Creations Grid */}
        {filteredAndSortedCreations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-10">
              <p className="text-muted-foreground">
                {searchTerm ? 'No creations found matching your search.' : 'No creations found.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedCreations.map((creation) => {
              const IconComponent = getCreationIcon(creation.creation_type);
              
              return (
                <Card key={creation.id} className="hover:shadow-lg transition-shadow">
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
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
