import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { useState } from 'react'
import { useEffect } from 'react'
import { PDFDocument, rgb } from 'pdf-lib'

export function BugIndex() {
  const [bugs, setBugs] = useState([])
  const [filteredBugs, setFilteredBugs] = useState([])
  const [search, setSearch] = useState('')
  const [severity, setSeverity] = useState('')

  useEffect(() => {
    loadBugs()
  }, [])

  useEffect(() => {
    if (search !== '') {
      setFilteredBugs(bugs.filter(bug => bug.title.toLowerCase().includes(search.toLowerCase())))
    } else {
      setFilteredBugs(bugs)
    }

    if (severity !== '') {
      setFilteredBugs(filteredBugs.filter(bug => bug.severity === +severity))
    }
  }, [search, severity])

  function onSearch(ev) {
    setSearch(ev.target.value)
  }

  function onFilterBySeverity(ev) {
    setSeverity(ev.target.value)
  }

  async function loadBugs() {
    const bugs = await bugService.query()
    setBugs(bugs)
    setFilteredBugs(bugs)
  }

  async function onRemoveBug(bugId) {
    try {
      await bugService.remove(bugId)
      console.log('Deleted Succesfully!')
      setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
      showSuccessMsg('Bug removed')
    } catch (err) {
      console.log('Error from onRemoveBug ->', err)
      showErrorMsg('Cannot remove bug')
    }
  }

  async function onAddBug() {
    const bug = {
      title: prompt('Bug title?'),
      severity: +prompt('Bug severity?'),
      description: prompt('Bug description?')
    }
    try {
      const savedBug = await bugService.save(bug)
      console.log('Added Bug', savedBug)
      setBugs(prevBugs => [...prevBugs, savedBug])
      showSuccessMsg('Bug added')
    } catch (err) {
      console.log('Error from onAddBug ->', err)
      showErrorMsg('Cannot add bug')
    }
  }

  async function onEditBug(bug) {
    const severity = +prompt('New severity?')
    const bugToSave = { ...bug, severity }
    try {

      const savedBug = await bugService.save(bugToSave)
      console.log('Updated Bug:', savedBug)
      setBugs(prevBugs => prevBugs.map((currBug) =>
        currBug._id === savedBug._id ? savedBug : currBug
      ))
      showSuccessMsg('Bug updated')
    } catch (err) {
      console.log('Error from onEditBug ->', err)
      showErrorMsg('Cannot update bug')
    }
  }
  async function onDownloadPDF() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 12;

    // Add title
    page.drawText('Bug List', {
      x: 50,
      y: height - 4 * fontSize,
      size: 20,
      color: rgb(0, 0, 0),
    });

    let yPosition = height - 6 * fontSize;

    // Add each bug to the PDF
    bugs.forEach(bug => {
      page.drawText(`Title: ${bug.title}`, { x: 50, y: yPosition, size: fontSize });
      yPosition -= fontSize;
      page.drawText(`Severity: ${bug.severity}`, { x: 50, y: yPosition, size: fontSize });
      yPosition -= fontSize;
      if (bug.description) {
        page.drawText(`Description: ${bug.description}`, { x: 50, y: yPosition, size: fontSize });
      }
      yPosition -= 2 * fontSize; // Add extra space between bugs
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bugs.pdf';
    link.click();
  }

  return (
    <main className="bug-index">
      <h3>Bugs App</h3>
      <main>
        <button className='add-btn' onClick={onAddBug}>Add Bug ⛐</button>
        <input className='filter-input' type="text" placeholder='Search...' onChange={onSearch} />
        <input className='filter-input' type="number" placeholder='Filter by severity...' onChange={onFilterBySeverity} />
        <button className='download-btn' onClick={onDownloadPDF}>Download PDF</button>
        <BugList bugs={filteredBugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
      </main>
    </main>
  )
}
