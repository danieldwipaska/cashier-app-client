import { IUser } from '../context/AuthContext';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const useCheckToken = (user: IUser) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Cek apakah username ada
    if (!user.username) {
      navigate('/login');
      return; // Penting: tambahkan return untuk memberhentikan eksekusi
    }

    // Fungsi untuk verifikasi token
    const verifyToken = async () => {
      try {
        await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        });
      } catch (err) {
        // Hapus localStorage
        localStorage.removeItem('username');
        localStorage.removeItem('shopCode');
        localStorage.removeItem('access-token');

        // Navigasi ke halaman login
        navigate('/login');
      }
    };

    // Jalankan verifikasi token
    verifyToken();

    // Optional: Cleanup function
    return () => {
      // Pembersihan jika diperlukan
    };
  }, [user.username, navigate]);
};
