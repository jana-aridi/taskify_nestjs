const getLocalStorageUser = () => {
    const parsedUser = JSON.parse(localStorage.getItem("user"));
    return parsedUser;
};
  
const setLocalStorageUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
};

const getToken = () => {
    return localStorage.getItem("token");
};

const LocalStorageFile = {
    getLocalStorageUser,
    setLocalStorageUser,
    getToken,
};

export default LocalStorageFile;
  