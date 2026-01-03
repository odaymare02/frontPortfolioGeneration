import { useEffect, useState } from "react";
import api from "../api/axios";
import {jwtDecode}from "jwt-decode"

export default function usePortfolio({ Uname }) {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const decode=jwtDecode(localStorage.getItem('ptoken'));

  const fetchPortfolio = async () => {
  setLoading(true);
  setError(null);
  try {
    const res = await api.get(`/portfolios/${Uname}`);
    setPortfolio(res.data);
  } catch (err) {
    if (err.response?.status === 404) {
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
      setError(err.response?.data?.message || err.message);
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (Uname) fetchPortfolio();
  }, [Uname]);

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

      setPortfolio(res.data);
      return res.data;

    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };


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
