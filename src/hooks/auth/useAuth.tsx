import { isLoggedAtom } from "@/store/auth";
import { clearLS } from "@/utils/auth";
import { useAtom } from "jotai";

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedAtom);
  const login = () => {};

  const handleLogout = async () => {
    // await authApi.logout();
    window.location.href = `/login`; //REMOVE WHEN DONE LOGIN API
    clearLS();
    setIsLoggedIn(false);
  };

  return {
    isLoggedIn,
    login,
    logout: handleLogout,
  };
};

export default useAuth;
