export const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  console.log('Cookie:: ', value)
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};