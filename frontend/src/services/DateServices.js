export const formatDate = (dateString) => {
    const releaseDate = new Date(dateString);
    const day = releaseDate.getDate();
    const month = releaseDate.getMonth() + 1;
    const year = releaseDate.getFullYear();
    return `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;
  };