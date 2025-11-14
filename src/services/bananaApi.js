/**
 * Fetches a new puzzle from the Banana API.
 * @returns {Promise<Object>} A promise that resolves to { question: "image_url", solution: 123 }
 */
export const fetchBananaPuzzle = () => {
  return fetch('https://marcconrad.com/uob/banana/api.php')
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .catch(err => {
      console.error("Failed to fetch puzzle:", err);
      // Return a fallback puzzle in case the API is down
      return {
        question: "https://placehold.co/400x200?text=API+Error",
        solution: 1
      };
    });
};