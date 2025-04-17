import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import ChatRoomList from './components/ChatRoomList';
import ChatRoom from './components/ChatRoom';
import CreateChatRoom from './components/CreateChatRoom';

const App: React.FC = () => {
  return (
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/chat" element={<PrivateRoute><ChatRoomList /></PrivateRoute>} />
            <Route path="/chat/room/:id" element={<PrivateRoute><ChatRoom /></PrivateRoute>} />
            <Route path="/chat/create" element={<PrivateRoute><CreateChatRoom /></PrivateRoute>} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
  );
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }
  const { user } = authContext;
  return user ? <>{children}</> : <Navigate to="/login" />;
};

export default App;