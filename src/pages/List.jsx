import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import ListingItem from "../components/ListingItem";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";

function List() {
  const [tasks, setTasks] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Get reference
        const tasksRef = collection(db, "tasks");

        // Create a query
        const q = query(tasksRef, where("userRef", "==", auth.currentUser.uid));

        // Execute query
        const querySnap = await getDocs(q);

        const tasks = [];

        querySnap.forEach((doc) => {
          return tasks.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        // setTasks(tasks);
        // setLoading(false);
        setTasks(tasks);
        setLoading(false);
      } catch (error) {
        toast.error("Could not fetch tasks");
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="category">
      <header className="taskHeader">
        <p className="pageHeader">Tasks</p>
        <Link to="/create-tasks">
          <ListItemAvatar className="createListing">
            <IconButton>
              <AddIcon />
            </IconButton>
            Add Tasks
          </ListItemAvatar>
        </Link>
      </header>

      {loading ? (
        "Loading..."
      ) : tasks && tasks.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {tasks.map((tasks) => (
                <ListingItem tasks={tasks.data} id={tasks.id} key={tasks.id} />
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p>There are no current offers</p>
      )}
    </div>

    // <div></div>
  );
}

export default List;
