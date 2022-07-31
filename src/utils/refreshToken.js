import axios from "axios";
import { tokenRoute } from "./APIs";

export const refreshToken = async () => {
  const user = localStorage.getItem("yamess-user");
  try {
    const { refreshToken: storageRefreshToken, _id: userId } = JSON.parse(user);
    const { data } = await axios.get(tokenRoute, {
      headers: {
        Authorization: `Bearer ${storageRefreshToken}`,
      },
      params: {
        userId,
      },
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
};
