import { Link } from "react-router-dom";
import { BugPreview } from "./BugPreview";
import { UpdateBugModal } from "./UpdateBugModal";

export function BugList({ bugs, onRemoveBug, onEditBug, labels, user }) {
  return (
    <ul className="bug-list">
      {bugs.map((bug) => (
        <li className="bug-list-item" key={bug._id}>
          <BugPreview bug={bug} labels={labels} />
          {user &&
            (user._id === bug?.creator?._id || user.role === "admin") && (
              <div>
                <button
                  onClick={() => {
                    onRemoveBug(bug._id);
                  }}
                >
                  x
                </button>
                <UpdateBugModal
                  bug={bug}
                  labels={labels}
                  updateBug={onEditBug}
                />
              </div>
            )}
          <Link to={`/bug/${bug._id}`}>Details</Link>
        </li>
      ))}
    </ul>
  );
}
