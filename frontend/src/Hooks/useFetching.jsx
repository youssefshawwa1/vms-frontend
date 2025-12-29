// hooks/useFetching.js
import { useOverLay } from "../Contexts/OverLayContext";
import { API, LoadingTime, MessageTime } from "../Components/Global/Global";
const useFetching = () => {
  const { hideLoading, showMessage, hideMessage, showLoading } = useOverLay();

  const fetchData = async (where, callBack, normal) => {
    showLoading();
    try {
      const url = `${API}${where}`;
      const response = await fetch(url, {
        method: "GET",
        credentials: "include", // This is CRUCIAL
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        showMessage("Server can't be Reached!", "Internal Error");
        setTimeout(() => {
          hideLoading();
        }, LoadingTime);
        return response;
      }
      if (normal) {
        setTimeout(() => hideLoading(), LoadingTime);
        return response;
      }
      const resp = await response.json();

      if (resp.result) {
        setTimeout(() => hideLoading(), LoadingTime);
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
      showMessage("Server Error!", "Internal Error");
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
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      // const respons = await response.text();
      // console.log(respons);
      // return;
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
