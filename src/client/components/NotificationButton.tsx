import { useState } from 'react';
import bell from '../../assets/bell.svg';
import { Button } from '@chakra-ui/react';

function NotificationButton() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'friend_request',
      message: 'seokchoi가 친구 요청을 했습니다.',
      status: 'unread',
    },
    {
      id: 2,
      type: 'game_request',
      message: 'jungchoi이 게임 요청을 했습니다.',
      status: 'unread',
    },
    {
      id: 3,
      type: 'message',
      message: 'doykim이 메시지를 보냈습니다.',
      status: 'unread',
    },
    {
      id: 4,
      type: 'game_request',
      message: 'soopark이 게임 요청을 했습니다.',
      status: 'unread',
    },
  ]);

  const handleNotificationResponse = (e, id) => {
    e.stopPropagation();
    removeNotification(id);
  };

  const removeNotification = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id),
    );
  };

  const getNotificationButtons = (notification) => {
    if (
      notification.type === 'friend_request' ||
      notification.type === 'game_request'
    ) {
      return [
        {
          label: 'Accept',
          color: 'green',
          onClick: (e) => handleNotificationResponse(e, notification.id),
        },
        {
          label: 'Decline',
          color: 'red',
          onClick: (e) => handleNotificationResponse(e, notification.id),
        },
      ];
    } else {
      return [
        {
          label: 'Close',
          color: 'gray',
          onClick: (e) => handleNotificationResponse(e, notification.id),
        },
      ];
    }
  };

  const NotificationButton = ({ label, color, onClick }) => {
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
                  key={notification.id}
                  className="flex flex-col justify-between items-start p-3 border-b"
                >
                  <span className="text-sm mb-2">{notification.message}</span>
                  <div className="flex gap-2">
                    {getNotificationButtons(notification).map(
                      (buttonData, index) => (
                        <NotificationButton
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
