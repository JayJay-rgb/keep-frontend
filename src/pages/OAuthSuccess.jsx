import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

function OAuthSuccess() {
  const navigate = useNavigate();
  const { fetchProfile } = useContext(AuthContext);

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      console.log("1. OAuth success page loaded");

      const params = new URLSearchParams(window.location.search);

      const accessToken = params.get("accessToken");
      const refreshToken = params.get("refreshToken");

      console.log("2. Access token exists:", !!accessToken);
      console.log("3. Refresh token exists:", !!refreshToken);

      if (!accessToken || !refreshToken) {
        console.log("4. Missing tokens");
        navigate("/auth", { replace: true });
        return;
      }

      try {
        console.log("5. Saving tokens");

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        console.log("6. Fetching profile");

        await fetchProfile();

        console.log("7. Profile fetched");

        console.log("8. Navigating to home");

        navigate("/", { replace: true });

        console.log("9. Navigation called");
      } catch (error) {
        console.error("10. OAuth success error:", error);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        navigate("/auth", { replace: true });
      }
    };

    handleOAuthSuccess();
  }, [fetchProfile, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Signing you in...</p>
    </div>
  );
}

export default OAuthSuccess;