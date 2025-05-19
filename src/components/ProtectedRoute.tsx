import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import checkActiveSubscription from "../scripts/payments/checkSubscription";
import DashboardSkeleton from "./Skeleton/Skeleton";
import PricingDecorator from "./Pricing/PricingDecorator";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [cookies] = useCookies(["accessToken", "refreshToken"]);
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSubscription = async () => {
      const status = await checkActiveSubscription(navigate);
      setIsSubscribed(status);
    };
    checkSubscription();
  }, [cookies.accessToken, cookies.refreshToken]);

  if (isSubscribed === null) {
    return <DashboardSkeleton />;
  }

  if (!isSubscribed) {
    return <PricingDecorator>{children}</PricingDecorator>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
