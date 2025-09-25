// hooks/useFetching.js
import { useLoading } from "../../../contexts/LoadingContext";
import { API, LoadingTime, MessageTime } from "../Global";

const useFetching = () => {
  const { hideLoading, showMessage, hideMessage, showLoading } = useLoading();

  const fetchData = async (where, callBack) => {
    showLoading();
    try {
      const url = `${API}${where}`;
      const response = await fetch(url);
      const resp = await response.json();

      if (resp.result) {
        setTimeout(() => hideLoading(), LoadingTime);
        // Usually you want to return the data, not just result
        if (callBack) {
          callBack(resp.data);
        } else {
          return resp.data;
        }
      } else {
        setTimeout(() => {
          showMessage(resp.message, "Internal Error");
          hideLoading();
        }, LoadingTime);
      }
    } catch (error) {
      console.error(error);
      showMessage("Server can't be Reached!", "Internal Error");
      setTimeout(() => {
        hideLoading();
      }, LoadingTime);
    } finally {
      setTimeout(() => hideMessage(), MessageTime);
    }
  };

  const sendData = async (where, data, callBack) => {
    showLoading();
    try {
      const url = `${API}${where}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const resp = await response.json();

      if (resp.result) {
        setTimeout(() => {
          showMessage(resp.message, "Success");
          hideLoading();
        }, LoadingTime);
        if (callBack) {
          callBack();
        }
      } else {
        setTimeout(() => {
          showMessage(resp.message, "Internal Error");
          hideLoading();
        }, LoadingTime);
      }
    } catch (error) {
      console.error(error);
      showMessage("Server can't be Reached!", "Internal Error");
      setTimeout(() => {
        hideLoading();
      }, LoadingTime);
    } finally {
      setTimeout(() => hideMessage(), MessageTime);
    }
  };

  return { fetchData, sendData };
};

export default useFetching;
