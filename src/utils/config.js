const userString = localStorage.getItem("user");

// Parse the JSON string to an object
const user = userString ? JSON.parse(userString) : null;

// Access the token property
const token = user ? user.token : null;

export const config = {
  headers: {
    Authorization: `Bearer ${
      token !== null ? token : ""
    }`,
    Accept: "application/json",
  },
};


export const isAdmin = () =>{
  return user.role === 'admin'
}