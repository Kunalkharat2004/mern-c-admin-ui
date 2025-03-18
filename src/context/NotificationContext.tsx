import React, { createContext, useContext } from "react";
import { message } from "antd";

interface NotificationContextProps {
  success: (content: string) => void;
  error: (content: string) => void;
  warning: (content: string) => void;
  info: (content: string) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const notify: NotificationContextProps = {
    success: (content: string) => messageApi.open({ type: "success", content }),
    error: (content: string) => messageApi.open({ type: "error", content }),
    warning: (content: string) => messageApi.open({ type: "warning", content }),
    info: (content: string) => messageApi.open({ type: "info", content }),
  };

  return (
    <NotificationContext.Provider value={notify}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextProps => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
