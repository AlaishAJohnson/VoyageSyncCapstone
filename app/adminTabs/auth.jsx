
export const getAuthHeader = () => {
    const authHeader = 'Basic ' + btoa('admin:admin');
    return {
      headers: {
        'Authorization': authHeader,
      },
    };
  };
  