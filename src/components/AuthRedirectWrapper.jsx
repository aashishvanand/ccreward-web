import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../app/providers/AuthContext";

const AuthRedirectWrapper = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      router.push("/");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner component
  }

  return isAuthenticated() ? children : null;
};

export default AuthRedirectWrapper;
