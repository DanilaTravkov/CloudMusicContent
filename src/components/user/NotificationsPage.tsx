import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Bell, Music, Disc3, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Layout } from '../Layout';

interface Notification {
  id: string;
  type: 'new_song' | 'new_album';
  title: string;
  artist: string;
  genre: string;
  timestamp: string;
  read: boolean;
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'new_song',
      title: 'New single "Velvet Sky" released',
      artist: 'Sophia Rivers',
      genre: 'Jazz',
      timestamp: '2 hours ago',
      read: false
    },
    {
      id: '2',
      type: 'new_album',
      title: 'New album "Electric Dreams" available',
      artist: 'Luna Eclipse',
      genre: 'Electronic',
      timestamp: '1 day ago',
      read: false
    },
    {
      id: '3',
      type: 'new_song',
      title: 'Marcus Stone dropped a new track',
      artist: 'Marcus Stone',
      genre: 'Hip Hop',
      timestamp: '2 days ago',
      read: true
    },
    {
      id: '4',
      type: 'new_album',
      title: 'The Midnight Riders released "Night Drive"',
      artist: 'The Midnight Riders',
      genre: 'Rock',
      timestamp: '1 week ago',
      read: true
    }
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };
  const unreadCount = notifications.filter(n => !n.read).length;

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white text-2xl mb-1">Notifications</h2>
            <p className="text-purple-300">
              {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Mark all as read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map(notification => (
            <Card
              key={notification.id}
              className={`transition-all ${
                notification.read
                  ? 'bg-white/5 border-white/10'
                  : 'bg-purple-600/10 border-purple-500/30'
              } hover:bg-white/10`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`size-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    notification.type === 'new_song'
                      ? 'bg-gradient-to-br from-purple-500 to-indigo-600'
                      : 'bg-gradient-to-br from-pink-500 to-purple-600'
                  }`}>
                    {notification.type === 'new_song' ? (
                      <Music className="size-6 text-white" />
                    ) : (
                      <Disc3 className="size-6 text-white" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-white">{notification.title}</h3>
                      {!notification.read && (
                        <span className="size-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></span>
                      )}
                    </div>
                    <p className="text-purple-300 text-sm mb-2">By {notification.artist}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs bg-purple-900/50 text-purple-200">
                        {notification.genre}
                      </Badge>
                      <span className="text-purple-400 text-xs">{notification.timestamp}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Mark read
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(notification.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-white/5 border-white/10 p-12 text-center">
          <Bell className="size-16 text-purple-500 mx-auto mb-4" />
          <h3 className="text-white text-xl mb-2">No notifications</h3>
          <p className="text-purple-300">
            Subscribe to artists and genres to receive notifications about new releases
          </p>
        </Card>      )}
    </div>
  );

  return (
    <Layout showNavigation={true}>
      {content}
    </Layout>
  );
}
