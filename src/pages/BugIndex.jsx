import { bugService } from "../services/bug.service.js";
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js";
import { BugList } from "../cmps/BugList.jsx";
import { useState } from "react";
import { useEffect } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { Select, Checkbox, Input } from "antd";
import { AddBugModal } from "../cmps/AddBugModal.jsx";
import dayjs from "dayjs";

export function BugIndex({ user }) {
  const [bugs, setBugs] = useState([]);
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [totalBugs, setTotalBugs] = useState(0);
  const [isPaginated, setIsPaginated] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [labels, setLabels] = useState([]);
  const [selectedLabels, setSelectedLabels] = useState([]);

  useEffect(() => {
    loadBugs();
  }, []);

  useEffect(() => {
    loadBugs();
  }, [search, severity, createdAt, sortBy, page, isPaginated, selectedLabels]);

  function onSearch(ev) {
    setSearch(ev.target.value);
  }

  function onFilterBySeverity(ev) {
    setSeverity(ev.target.value);
  }

  function onFilterByCreatedAt(ev) {
    setCreatedAt(ev.target.value);
  }

  function onSelectFilter(value) {
    setSortBy(value);
  }

  function onChangePage(ev) {
    if (ev === "next" && page < Math.ceil(totalBugs / pageSize)) {
      setPage(page + 1);
    } else if (ev === "prev" && page > 1) {
      setPage(page - 1);
    }
  }

  function onSelectLabel(values) {
    setSelectedLabels(values);
  }

  async function loadBugs() {
    try {
      const filterBy = {
        severity,
        title: search,
        createdAt,
        sortBy,
        page,
        isPaginated,
        labels: selectedLabels,
      };
      const data = await bugService.query(filterBy);
      const bugs = data.bugs;
      setLabels(data.labels);
      setTotalBugs(data.totalBugs);
      setPageSize(data.pageSize);
      setBugs(bugs);
    } catch (err) {
      console.log("Error from loadBugs ->", err);
      showErrorMsg("Cannot load bugs");
    }
  }

  async function onRemoveBug(bugId) {
    try {
      await bugService.remove(bugId);
      setBugs((prevBugs) => prevBugs.filter((bug) => bug._id !== bugId));
      showSuccessMsg("Bug removed");
    } catch (err) {
      console.log("Error from onRemoveBug ->", err);
      showErrorMsg("Cannot remove bug");
    }
  }

  async function onAddBug(bug) {
    if (user) {
      bug.creator = {
        _id: user._id,
        fullname: user.fullname,
      };
    } else {
      return;
    }

    try {
      const res = await bugService.save(bug);
      if (res.message === "Bug added") {
        setBugs((prevBugs) => [...prevBugs, res.bug]);
        showSuccessMsg("Bug added");
      }
    } catch (err) {
      console.log("Error from onAddBug ->", err);
      showErrorMsg("Cannot add bug");
    }
  }

  async function onEditBug(bug) {
    try {
      const res = await bugService.save(bug);
      if (res.message === "Bug updated") {
        setBugs((prevBugs) =>
          prevBugs.map((currBug) =>
            currBug._id === res.bug._id ? res.bug : currBug
          )
        );
        showSuccessMsg("Bug updated");
      }
    } catch (err) {
      console.log("Error from onEditBug ->", err);
      showErrorMsg("Cannot update bug");
    }
  }

  async function onDownloadPDF() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 12;

    // Add title
    page.drawText("Bug List", {
      x: 50,
      y: height - 4 * fontSize,
      size: 20,
      color: rgb(0, 0, 0),
    });

    let yPosition = height - 6 * fontSize;

    // Add each bug to the PDF
    bugs.forEach((bug) => {
      page.drawText(`Title: ${bug.title}`, {
        x: 50,
        y: yPosition,
        size: fontSize,
      });
      yPosition -= fontSize * 1.5;
      page.drawText(`Severity: ${bug.severity}`, {
        x: 50,
        y: yPosition,
        size: fontSize,
      });
      yPosition -= fontSize * 1.5;
      if (bug.description) {
        page.drawText(`Description: ${bug.description}`, {
          x: 50,
          y: yPosition,
          size: fontSize,
        });
        yPosition -= fontSize * 1.5;
      }
      if (bug.labels) {
        page.drawText(
          `Labels: ${bug.labels.map((label) => label.title).join(", ")}`,
          {
            x: 50,
            y: yPosition,
            size: fontSize,
          }
        );
        yPosition -= fontSize * 1.5;
      }
      if (bug.creator) {
        page.drawText(`Creator: ${bug.creator.fullname}`, {
          x: 50,
          y: yPosition,
          size: fontSize,
        });
        yPosition -= fontSize * 1.5;
      }
      if (bug.createdAt) {
        page.drawText(
          `Created At: ${dayjs(bug.createdAt).format("DD/MM/YYYY")}`,
          {
            x: 50,
            y: yPosition,
            size: fontSize,
          }
        );
        yPosition -= fontSize * 1.5;
      }
      yPosition -= 2 * fontSize;
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bugs.pdf";
    link.click();
  }

  return (
    <main className="bug-index">
      <h3>Bugs App</h3>
      <main>
        {user && <AddBugModal addBug={onAddBug} labels={labels} />}
        <button className="download-btn" onClick={onDownloadPDF}>
          Download PDF
        </button>
        <Input
          className="filter-input"
          type="text"
          placeholder="Search..."
          onChange={onSearch}
        />
        <Input
          className="filter-input"
          type="number"
          placeholder="Filter by severity..."
          onChange={onFilterBySeverity}
        />
        <Input
          className="filter-input"
          type="date"
          placeholder="Filter by createdAt..."
          onChange={onFilterByCreatedAt}
        />
        <Select
          className="filter-input"
          mode="multiple"
          style={{ width: 200 }}
          placeholder="Filter by label..."
          onChange={onSelectLabel}
          value={selectedLabels}
          allowClear={true}
          options={labels.map((label) => ({
            value: label.id,
            label: label.title,
          }))}
        />
        <Select
          className="filter-input"
          style={{ width: 200 }}
          placeholder="Sort by..."
          onChange={onSelectFilter}
          value={sortBy}
          allowClear={true}
          options={[
            { value: "title", label: "Title" },
            { value: "severity", label: "Severity" },
            { value: "createdAt", label: "Created At" },
          ]}
        />
        <label className="is-paginated">
          <Checkbox
            onChange={(e) => setIsPaginated(e.target.checked)}
            className="is-paginated"
          />
          isPaginated
        </label>
        {isPaginated && (
          <label className="filter-input">
            <button onClick={() => onChangePage("prev")} disabled={page === 1}>
              Prev
            </button>
            {page}/{Math.ceil(totalBugs / pageSize)}
            <button
              onClick={() => onChangePage("next")}
              disabled={page === Math.ceil(totalBugs / pageSize)}
            >
              Next
            </button>
          </label>
        )}

        <BugList
          bugs={bugs}
          onRemoveBug={onRemoveBug}
          onEditBug={onEditBug}
          labels={labels}
          user={user}
        />
      </main>
    </main>
  );
}
