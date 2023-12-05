import { useEffect, useState } from 'react';
import bell from '../../assets/bell.svg';
import { Button } from '@chakra-ui/react';
import axios from 'axios';
import { appSocket } from '../../common/socket/app.socket';
import { useNavigate } from 'react-router-dom';

interface ButtonData {
  label: string;
  color: string;
  onClick: (e: React.MouseEvent) => void;
}

interface INotification {
  idx: number;
  sender_idx: number;
  content: string;
  type: string;
  room_idx?: number;
  // status: string;
}

type NotificationButtonProps = {
  userIdx: number;
};

function NotificationButton(props: NotificationButtonProps) {
  const navigate = useNavigate();

  const { userIdx } = props;

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const fetchNotificationList = async () => {
    try {
      const notifications = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/alarms/${userIdx}`,
      );
      console.log('notifications', notifications);
      const formattedNotifications = notifications.data.map(
        (notification: INotification) => ({
          idx: notification.idx,
          sender_idx: notification.sender_idx,
          content: notification.content,
          type: notification.type,
        }),
      );
      console.log('formattedNotifications', formattedNotifications);
      setNotifications(formattedNotifications);
    } catch (error) {
      console.log(error);
    }
  };

  const addNotification = (notification: INotification) => {
    console.log('notify!', notification);
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      notification,
    ]);
  };

  useEffect(() => {
    appSocket.on('notification', addNotification);
    appSocket.on('notificationList', (notifications: INotification[]) => {
      setNotifications(notifications);
    });

    fetchNotificationList();

    return () => {
      appSocket.off('notification');
      appSocket.off('notificationList');
    };
  }, [appSocket]);

  // const removeNotification = (idx: number) => {
  //   setNotifications(
  //     notifications.filter((notification) => notification.idx !== idx),
  //   );
  // };

  const handleAcceptFriendRequest = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    appSocket.emit('acceptFriendRequest', idx);
  };

  const handleDeclineFriendRequest = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    console.log('handleDeclineFriendRequest', idx);
    appSocket.emit('declineFriendRequest', idx);
  };

  const handleGeneral = (e: React.MouseEvent, notification: INotification) => {
    e.stopPropagation();
    // removeNotification(notification.idx);
    // navigate(`/dm/${notification.sender_idx}`);
    appSocket.emit('generalNotification', notification.idx);
  };

  const handleOpen = (e: React.MouseEvent, notification: INotification) => {
    e.stopPropagation();
    navigate(`/dm/${notification.room_idx}`);
    appSocket.emit('generalNotification', notification.idx);
  };

  const getNotificationButtons = (notification: INotification) => {
    if (notification.type === 'friend_request') {
      console.log('sdf', notification);
      return [
        {
          label: 'Accept',
          color: 'green',
          onClick: (e: React.MouseEvent) =>
            handleAcceptFriendRequest(e, notification.idx),
        },
        {
          label: 'Decline',
          color: 'red',
          onClick: (e: React.MouseEvent) =>
            handleDeclineFriendRequest(e, notification.idx),
        },
      ];
    } else if (notification.type === 'dm') {
      return [
        {
          label: 'Open',
          color: 'blue',
          onClick: (e: React.MouseEvent) => handleOpen(e, notification),
        },
      ];
    } else {
      return [
        {
          label: 'Close',
          color: 'gray',
          onClick: (e: React.MouseEvent) => handleGeneral(e, notification),
        },
      ];
    }
  };

  const NotificationAction = (props: ButtonData) => {
    const { label, color, onClick } = props;

    return (
      <Button size="sm" colorScheme={color} onClick={onClick}>
        {label}
      </Button>
    );
  };

  return (
    <div className="w-1/2 flex justify-center items-center">
      <div
        className="relative"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <img className="object-scale-down h-12 w-12" src={bell} alt="bell" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
        )}
        {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 min-h-60 max-h-60 bg-white border rounded-lg shadow-lg overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.idx}
                  className="flex flex-col justify-between items-start p-3 border-b"
                >
                  <span className="text-sm mb-2">{notification.content}</span>
                  <div className="flex gap-2">
                    {getNotificationButtons(notification).map(
                      (buttonData, index) => (
                        <NotificationAction
                          key={index}
                          label={buttonData.label}
                          color={buttonData.color}
                          onClick={buttonData.onClick}
                        />
                      ),
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-full">
                <span>No notifications</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationButton;
