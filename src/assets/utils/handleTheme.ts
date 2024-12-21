export const getSubdomain = () => {
  const host = window.location.hostname.split('.'); 
  
  let subdomain = 'local';
  let staging = false; 
  
  if (host.length >= 2) {
    subdomain = host[0];
    staging = host[1] === 'staging';
  }
  console.log(host)
  console.log(subdomain); 
  return { subdomain, staging };
};
