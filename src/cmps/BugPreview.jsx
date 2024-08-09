import dayjs from "dayjs";

export function BugPreview({ bug, labels }) {
  return (
    <article className="bug-preview">
      <h4>{bug.title}</h4>
      <h1>🐛</h1>
      <p>
        Severity: <span>{bug.severity}</span>
      </p>
      <p>
        Created At: <span>{dayjs(bug.createdAt).format("DD/MM/YYYY")}</span>
      </p>
      <p>
        Labels: <span>{bug?.labels?.join(", ")}</span>
      </p>
    </article>
  );
}
