export const setAuth = (token: string, user: unknown) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUser = () => {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  return JSON.parse(user);
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};