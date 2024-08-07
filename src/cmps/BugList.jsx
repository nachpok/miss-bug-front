import { Link } from "react-router-dom";
import { BugPreview } from "./BugPreview";
import { UpdateBug } from "./UpdateBug";

export function BugList({ bugs, onRemoveBug, onEditBug, labels, user }) {
  return (
    <ul className="bug-list">
      {bugs.map((bug) => (
        <li className="bug-preview" key={bug._id}>
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
                {/* <button
                onClick={() => {
                  onEditBug(bug)
                }}
              >
                Edit
              </button> */}
                <UpdateBug bug={bug} labels={labels} updateBug={onEditBug} />
              </div>
            )}
          <Link to={`/bug/${bug._id}`}>Details</Link>
        </li>
      ))}
    </ul>
  );
}
