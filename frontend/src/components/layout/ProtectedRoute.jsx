import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isInitialized } = useAuthStore();
  const location = useLocation();

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-navy-200 border-t-navy-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
