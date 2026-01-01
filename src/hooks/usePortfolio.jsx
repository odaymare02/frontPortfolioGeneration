import { useEffect, useState } from "react";
import api from "../api/axios";
import {jwtDecode}from "jwt-decode"

export default function usePortfolio({ Uname }) {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const decode=jwtDecode(localStorage.getItem('ptoken'));

  // fetch portfolio by username
  const fetchPortfolio = async () => {
  setLoading(true);
  setError(null);
  try {
    console.log("objectasdasdasdasdsasddasd")
    const res = await api.get(`/portfolios/${Uname}`);
    setPortfolio(res.data);
    console.log(portfolio);
  } catch (err) {
    if (err.response?.status === 404) {
      // إذا ما فيه portfolio أنشئ واحد فارغ
      const emptyPortfolio = await createPortfolio({
        userId:decode.id,
        username: Uname,
        name: "newUser",
        title: "",
        about: "",
        profileImage: "",
        theme: "classic",
        skills: [],
        projects: [],
        experience: [],
        education: [],
        certificates: [],
        links: { github: "", linkedin: "", email: "", website: "" },
      });
      setPortfolio(emptyPortfolio);
    } else {
      // أي error ثاني
      setError(err.response?.data?.message || err.message);
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (Uname) fetchPortfolio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Uname]);

  // update portfolio
  const updatePortfolio = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.put(`/portfolios/${decode.id}`, data);
      setPortfolio(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // delete portfolio
  const deletePortfolio = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.delete("/portfolios");
      setPortfolio(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // upload profile image
  const uploadProfileImage = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post("/portfolios/upload-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPortfolio(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // upload project image
  const uploadProjectImage = async (projectId, file) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post(
        `/portfolios/upload-project/${projectId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setPortfolio(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

   const uploadCertificateImage = async (certificateId, file) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.post(
        `/portfolios/upload-certificate/${certificateId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // تحديث فوري للـ portfolio
      setPortfolio(res.data);
      return res.data;

    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };


  // update theme
  const updateTheme = async (theme) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.put("/portfolios/theme", { theme });
      setPortfolio(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createPortfolio = async (data) => {
  setLoading(true);
  setError(null);
  try {
    const res = await api.post("/portfolios", data);
    setPortfolio(res.data);
    return res.data;
  } catch (err) {
    setError(err.response?.data?.message || err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};

  return {
    setPortfolio,
    portfolio,
    loading,
    error,
    fetchPortfolio,
    updatePortfolio,
    createPortfolio,
    deletePortfolio,
    uploadProfileImage,
    uploadProjectImage,
    uploadCertificateImage,
    updateTheme,
  };
}
