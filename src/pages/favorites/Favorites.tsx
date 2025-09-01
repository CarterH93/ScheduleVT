import styles from "./Favorites.module.css";
import { useDocument } from "../../hooks/useDocument";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";

export default function Favorites() {
  const { user } = useAuthContext();
  const { document, error } = useDocument("users", user!.uid);
  const { updateDocument } = useFirestore("users");

  function handleDelete(index: number) {
    if (
      !window.confirm("Are you sure you want to delete this favorite schedule?")
    ) {
      return;
    }

    if (!document || !user) {
      return;
    }
    const newFavorites = [...document.favoriteSchedules];
    newFavorites.splice(index, 1);
    updateDocument(user.uid as string, {
      favoriteSchedules: newFavorites,
    });
  }

  return (
    <div>
      {document &&
        document.favoriteSchedules.length > 0 &&
        document.favoriteSchedules.map((schedule: string, index: number) => (
          <div className={styles.favorites} key={index}>
            <div className={styles.delete}>
              <h1>Schedule {index + 1}</h1>
              <button
                onClick={() => {
                  handleDelete(index);
                }}
              >
                Delete
              </button>
            </div>
            <p>{schedule}</p>
          </div>
        ))}
    </div>
  );
}
