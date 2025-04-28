import { Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import refreshAccessToken from '../scripts/auth/refreshAccessToken';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [cookies] = useCookies(['accessToken', 'refreshToken']);

  if (!cookies.accessToken && !cookies.refreshToken) {
    return <Navigate to="/sign-in" replace />;
  } else if (!cookies.accessToken && cookies.refreshToken) {
    refreshAccessToken()
  }
  return <>{children}</>;
};

export default ProtectedRoute;