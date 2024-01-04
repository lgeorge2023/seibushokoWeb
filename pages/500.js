import { clearToken } from '@/utils/cookieService';
import React, { useEffect } from 'react';

const Custom500 = () => {
  useEffect(() => {
    clearToken();
    localStorage.clear();
  }, []);

  return (
    <div className="error-container">
    <h1 className='error-text'>No Response from Server</h1>
  </div>
  );
};

export default Custom500;