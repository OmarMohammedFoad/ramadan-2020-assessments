const apiCall = (url) => {
  const postData = async (endpoint = "video-request", method = "POST", body) => {
    try {
      
      const response = await fetch(`${url}/${endpoint}`, {
        method,
        credentials: "include",
        // mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // console.log("Data has been sent successfully:", data);
      return data;
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      throw error;
    }
  };

  const getData = async (sortBy = "", searchTerm = "") => {
    try {
      const response = await fetch(
        `${url}/video-request?sortby=${sortBy}&searchBy=${searchTerm}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      throw error;
    }
  };

  const updateVote = async (data) => postData("video-request/vote", "PUT",data);

  return { postData, getData, updateVote };
};

export default apiCall;
