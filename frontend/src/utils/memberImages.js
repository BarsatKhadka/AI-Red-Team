// Member profile images
// Alice: First image (young man with dark hair and beard, low-angle selfie with blue sky)
// Bob: Second image (woman holding a child, outdoor moment with trees) - needs to be added

export const getMemberImage = (memberName) => {
  const images = {
    'Alice': 'https://scontent.fmem1-2.fna.fbcdn.net/v/t39.30808-6/558984540_858378364016403_4570482477033263348_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=EvXwf80_CpMQ7kNvwHkjuZk&_nc_oc=AdnIg_NdP6v87gbQrYhegzdIUlzHhPiURTx_liXiGgWMYI9yak4dICpeCRFBmYkuAYUb2Olc6VgIic-O33paPnhc&_nc_zt=23&_nc_ht=scontent.fmem1-2.fna&_nc_gid=n1QlycZIGmCBsLQ26PYxqg&oh=00_AfhYfiGInJ6k4Yuf4mNUAxolf6TFHB4wsGCO6lWdKn1j9A&oe=692028B5',
    'Bob': '/images/bob.jpg', // Add Bob's image URL here when available
  };
  
  return images[memberName] || null;
};

export default getMemberImage;

