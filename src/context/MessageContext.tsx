import SimpleSnackbar from 'components/snackbars/SimpleSnackbar';
import React, { useContext, useCallback } from 'react';

type MessageType = 'success' | 'error' | 'warning' | 'info';
interface Position {
    vertical: string;
    horizontal: string;
}

interface MessageState {
  text: string;
  type: MessageType;
  position?: Position;
}

interface MessageContextType {
  message: MessageState | null;
  showMessage: (text: string, type: MessageType, position?: Position) => void;
  clearMessage: () => void;
}

const MessageContext = React.createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({ children }: { children: React.ReactNode } ) => {
  const [message, setMessageState] = React.useState<MessageState | null>(null)
  const [open, setOpen] = React.useState(false);

  const showMessage = useCallback((text: string, type: MessageType, position?: Position) => {
    setMessageState({ text, type, position });
    setOpen(true);
  }, []);

  const clearMessage = useCallback(() => {
    setMessageState(null);
  }, []);

  const value = {
    message,
    showMessage,
    clearMessage,
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
      <SimpleSnackbar open={open} setOpen={setOpen} position={message?.position} message={message?.text} severity={message?.type} />
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};