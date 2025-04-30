import { Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import refreshAccessToken from '../scripts/auth/refreshAccessToken';
import verifyAuthToken from '../scripts/auth/verifyAuthToken';

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
  verifyAuthToken()
  return <>{children}</>;
};

export default ProtectedRoute;