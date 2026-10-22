import './App.css'
import { useState, useEffect } from 'react'
import { BriefcaseBusiness, X, Plus, MapPin, Clock3 } from 'lucide-react'
function App() {
    const [showJobForm, setShowJobForm] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')


const [jobs, setJobs] = useState(() => {
  try {
    const savedJobs = localStorage.getItem('hiresense-jobs')

    if (savedJobs !== null) {
      return JSON.parse(savedJobs)
    }
  } catch (error) {
    console.error('Could not load saved jobs:', error)
  }

  return [
    {
      id: 1,
      title: 'Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      skills: 'React, JavaScript, CSS',
      experience: '1–3 years',
    },
    {
      id: 2,
      title: 'Data Analyst',
      department: 'Analytics',
      location: 'Hybrid',
      type: 'Full-time',
      skills: 'SQL, Python, Excel',
      experience: '0–2 years',
    },
    {
      id: 3,
      title: 'Product Designer',
      department: 'Design',
      location: 'On-site',
      type: 'Full-time',
      skills: 'Figma, UX Research, Prototyping',
      experience: '2–4 years',
    },
  
  ]
})


useEffect(() => {
  try {
    localStorage.setItem('hiresense-jobs', JSON.stringify(jobs))
  } catch (error) {
    console.error('Could not save jobs:', error)
  }
}, [jobs])

const [candidates, setCandidates] = useState(() => {
  
  try {
    const savedCandidates = localStorage.getItem('hiresense-candidates')

    if (savedCandidates !== null) {
      const parsedCandidates = JSON.parse(savedCandidates)

      if (Array.isArray(parsedCandidates)) {
        return parsedCandidates
      }
    }
  } catch (error) {
    console.error('Could not load candidates:', error)
  }

  return [
    {
      id: 1,
      name: 'Aarav Sharma',
      email: 'aarav@example.com',
      skills: 'React, JavaScript, CSS',
      jobId: 1,
      status: 'Shortlisted',
    },
    {
      id: 2,
      name: 'Priya Verma',
      email: 'priya@example.com',
      skills: 'SQL, Python, Excel',
      jobId: 2,
      status: 'Applied',
    },
    {
      id: 3,
      name: 'Rohan Das',
      email: 'rohan@example.com',
      skills: 'Figma, UX Research, Prototyping',
      jobId: 3,
      status: 'Interview',
    },
  ]
})

useEffect(() => {
  try {
    localStorage.setItem(
      'hiresense-candidates',
      JSON.stringify(candidates)
    )
  } catch (error) {
    console.error('Could not save candidates:', error)
  }
}, [candidates])

const [showCandidateForm, setShowCandidateForm] = useState(false)

const [editingCandidateId, setEditingCandidateId] = useState(null)
const [viewingCandidate, setViewingCandidate] = useState(null)
const [showInterviewForm, setShowInterviewForm] = useState(false)
const [interviewDate, setInterviewDate] = useState('')
const [interviewType, setInterviewType] = useState('Video call')
const [candidateForm, setCandidateForm] = useState({
  name: '',
  email: '',
  skills: '',
  jobId: '',
  status: 'Applied',
})

const [candidateMessage, setCandidateMessage] = useState('')
const [candidateSearch, setCandidateSearch] = useState('')
const [candidateStatusFilter, setCandidateStatusFilter] = useState('All')


    const filteredJobs = jobs.filter((job) => {
  const searchText = searchTerm.toLowerCase()

  return (
    job.title.toLowerCase().includes(searchText) ||
    job.department.toLowerCase().includes(searchText) ||
    job.location.toLowerCase().includes(searchText) ||
    job.skills.toLowerCase().includes(searchText)
  )
})

function toggleJobStatus(jobId) {
  setJobs((currentJobs) =>
    currentJobs.map((job) =>
      job.id === jobId
        ? {
            ...job,
            status:
              (job.status || 'Active') === 'Closed'
                ? 'Active'
                : 'Closed',
          }
        : job
    )
  )
}

function deleteJob(jobId) {
  const confirmed = window.confirm(
    'Are you sure you want to delete this job? This cannot be undone.'
  )

  if (!confirmed) return

  setJobs((currentJobs) =>
    currentJobs.filter((job) => job.id !== jobId)
  )

  setJobMessage('Job deleted successfully.')
}


function updateCandidateStatus(candidateId, newStatus) {
  setCandidates((currentCandidates) =>
    currentCandidates.map((candidate) => {
      if (candidate.id !== candidateId) {
        return candidate
      }

      if (candidate.status === newStatus) {
        return candidate
      }

      const activityEntry = {
        id: Date.now(),
        message: `Status changed from ${candidate.status} to ${newStatus}`,
        date: new Date().toISOString(),
      }

      return {
        ...candidate,
        status: newStatus,
        activity: [
          ...(candidate.activity || []),
          activityEntry,
        ],
      }
    })
  )
}

function deleteCandidate(candidateId) {
  const candidate = candidates.find(
    (candidate) => candidate.id === candidateId
  )

  if (!candidate) return

  const confirmed = window.confirm(
    `Are you sure you want to delete ${candidate.name}?`
  )

  if (!confirmed) return

  setCandidates((currentCandidates) =>
    currentCandidates.filter(
      (candidate) => candidate.id !== candidateId
    )
  )
}


  const [jobForm, setJobForm] = useState({
    title: '',
    department: '',
    location: 'Remote',
    type: 'Full-time',
    skills: '',
    experience: '',
  })

  const [jobMessage, setJobMessage] = useState('')
    function handleJobSubmit(event) {
    event.preventDefault()

    const newJob = {
      id: Date.now(),
      ...jobForm,
    }

    setJobs((currentJobs) => [newJob, ...currentJobs])

    setJobMessage(`"${jobForm.title}" was added successfully.`)

    setJobForm({
      title: '',
      department: '',
      location: 'Remote',
      type: 'Full-time',
      skills: '',
      experience: '',
    })

    setShowJobForm(false)
  }
  // NEW: Interview statistics
const interviewCandidates = candidates.filter(
  (candidate) => candidate.interviewDate
)

const scheduledInterviewCount = interviewCandidates.filter(
  (candidate) =>
    (candidate.interviewStatus || 'Scheduled') === 'Scheduled'
).length

const completedInterviewCount = interviewCandidates.filter(
  (candidate) => candidate.interviewStatus === 'Completed'
).length

const cancelledInterviewCount = interviewCandidates.filter(
  (candidate) => candidate.interviewStatus === 'Cancelled'
).length

const totalInterviewCount = interviewCandidates.length

  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="brand">HireSense <span>AI</span></h2>

        <p className="menu-label">WORKSPACE</p>
        <nav>
          <a className="nav-link active" href="#dashboard">▦ Dashboard</a>
          <a className="nav-link" href="#jobs">▤ Jobs</a>
          <a className="nav-link" href="#candidates">♙ Candidates</a>
          <a className="nav-link" href="#applications">▣ Applications</a>
          <a className="nav-link" href="#analytics">▥ Analytics</a>
        </nav>

        <div className="sidebar-bottom">
          <div className="avatar">HS</div>
          <div>
            <strong>Recruiter Workspace</strong>
            <p>Free Demo Account</p>
          </div>
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        {jobMessage && (
  <div className="job-message">
    {jobMessage}
  </div>
)}

{showJobForm && (
  <div className="job-modal-backdrop">
    <section className="job-modal">
      <div className="job-modal-header">
        <div>
          <p className="eyebrow">HIRING WORKSPACE</p>
          <h2>Create a new job</h2>
          <p>Add the details for your next opening.</p>
        </div>

        <button
          type="button"
          className="close-button"
          onClick={() => setShowJobForm(false)}
          aria-label="Close form"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleJobSubmit}>
        <label>
          Job title *
          <input
            required
            value={jobForm.title}
            onChange={(event) =>
              setJobForm({ ...jobForm, title: event.target.value })
            }
            placeholder="e.g. Frontend Developer"
          />
        </label>

        <label>
          Department *
          <input
            required
            value={jobForm.department}
            onChange={(event) =>
              setJobForm({ ...jobForm, department: event.target.value })
            }
            placeholder="e.g. Engineering"
          />
        </label>

        <div className="job-form-row">
          <label>
            Location
            <select
              value={jobForm.location}
              onChange={(event) =>
                setJobForm({ ...jobForm, location: event.target.value })
              }
            >
              <option>Remote</option>
              <option>Hybrid</option>
              <option>On-site</option>
            </select>
          </label>

          <label>
            Employment type
            <select
              value={jobForm.type}
              onChange={(event) =>
                setJobForm({ ...jobForm, type: event.target.value })
              }
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
          </label>
        </div>

        <label>
          Required skills *
          <input
            required
            value={jobForm.skills}
            onChange={(event) =>
              setJobForm({ ...jobForm, skills: event.target.value })
            }
            placeholder="e.g. React, JavaScript, CSS"
          />
        </label>

        <label>
          Experience required
          <input
            value={jobForm.experience}
            onChange={(event) =>
              setJobForm({ ...jobForm, experience: event.target.value })
            }
            placeholder="e.g. 1–3 years"
          />
        </label>

        <div className="job-form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => setShowJobForm(false)}
          >
            Cancel
          </button>

          <button type="submit" className="primary-button">
            <Plus size={16} />
            Create Job
          </button>
        </div>
      </form>
    </section>
  </div>
)}
        <header className="topbar">
          <div>
            <p className="eyebrow">RECRUITMENT OVERVIEW</p>
            <h1>Dashboard</h1>
          </div>
          <button
  className="primary-button"
  onClick={() => {
    setJobMessage('')
    setShowJobForm(true)
  }}
>
  <Plus size={16} />
  Post a Job
</button>
                  </header>

        <section className="welcome">
          <div>
            <p className="welcome-tag">YOUR SMARTER HIRING WORKSPACE</p>
            <h2>Find the right talent, faster.</h2>
            <p>Manage your jobs, discover candidates, and make better-informed hiring decisions.</p>
          </div>
          <div className="welcome-icon">✦</div>
        </section>

        <section className="stats-grid">
         <article className="stat-card">
  <p>Active Jobs</p>
  <h2>{jobs.length + 9}</h2>
  <span className="stat-note">Currently recruiting</span>
</article>
          <article className="stat-card">
            <p>Total Candidates</p>
<h2>{candidates.length}</h2>
            <span className="stat-note">Across all job openings</span>
          </article>
          <article className="stat-card">
            <p>Interviews</p>
<h2>{scheduledInterviewCount}</h2>            <span className="stat-note">Scheduled this week</span>
          </article>


<article className="stat-card">
  <p>Offers Sent</p>
  <h2>{candidates.filter((candidate) => candidate.status === 'Offer Sent').length}</h2>
  <span className="stat-note">Candidates with offers sent</span>
</article>

        </section>

        <section className="stats-grid">
          <article className="stat-card">
            <p>Scheduled Interviews</p>
            <h2>{scheduledInterviewCount}</h2>
            <span className="stat-note">Awaiting completion</span>
          </article>

          <article className="stat-card">
            <p>Completed Interviews</p>
            <h2>{completedInterviewCount}</h2>
            <span className="stat-note">Successfully completed</span>
          </article>

          <article className="stat-card">
            <p>Cancelled Interviews</p>
            <h2>{cancelledInterviewCount}</h2>
            <span className="stat-note">Cancelled interviews</span>
          </article>

          <article className="stat-card">
            <p>Total Interviews</p>
            <h2>{totalInterviewCount}</h2>
            <span className="stat-note">All recorded interviews</span>
          </article>
        </section>


<section className="jobs-section" id="jobs">
  <div className="jobs-heading">
    <div>
      <p className="eyebrow">YOUR OPEN POSITIONS</p>
      <h2>Manage your jobs</h2>
      <p className="jobs-subtitle">
        Search and keep track of your job openings.
      </p>
    </div>

    <button
      className="primary-button"
      onClick={() => {
        setJobMessage('')
        setShowJobForm(true)
      }}
    >
      <Plus size={16} />
      Post a Job
    </button>
  </div>

  <div className="jobs-toolbar">
    <input
      className="jobs-search"
      type="search"
      placeholder="Search jobs, departments, or skills..."
      value={searchTerm}
      onChange={(event) => setSearchTerm(event.target.value)}
    />

    <span className="jobs-count">
      {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
    </span>
  </div>

  <div className="jobs-list">
    
    {filteredJobs.length > 0 ? (
      filteredJobs.map((job) => (
        <article className="job-card" key={job.id}>
          <div className="job-card-top">
            <div className="job-title-icon">
              <BriefcaseBusiness size={21} />
            </div>

            <div className="job-title-area">
              <h3>{job.title}</h3>
              <p>{job.department || 'General'}</p>
            </div>


<span
  className={`job-status ${
    (job.status || 'Active') === 'Closed'
      ? 'job-status-closed'
      : ''
  }`}
>
  {job.status || 'Active'}
</span>

          </div>

          <div className="job-details">
            <span>
              <MapPin size={15} />
              {job.location}
            </span>

            <span>
              <Clock3 size={15} />
              {job.type}
            </span>
          </div>

          <div className="job-skills">
            <strong>Required skills</strong>
            <p>{job.skills || 'Not specified'}</p>
          </div>

          <div className="job-card-footer">
            <span>
              Experience: {job.experience || 'Not specified'}
            </span>
          </div>

<div className="job-management-actions">
  <button
    type="button"
    className="job-action-button"
    onClick={() => toggleJobStatus(job.id)}
  >
    {(job.status || 'Active') === 'Closed'
      ? 'Reopen job'
      : 'Close job'}
  </button>

  <button
    type="button"
    className="job-action-button delete-job-button"
    onClick={() => deleteJob(job.id)}
  >
    <X size={14} />
    Delete
  </button>
</div>

        </article>
      ))
    ) : (
      <div className="jobs-empty">
        <BriefcaseBusiness size={30} />
        <h3>No jobs found</h3>
        <p>Try another search, or create a new job opening.</p>
      </div>
    )}
  </div>
</section>

{showCandidateForm && (
  <div className="job-modal-backdrop">
    <section className="job-modal">
      <div className="job-modal-header">
        <div>
          <p className="eyebrow">HIRING WORKSPACE</p>
<h2>{editingCandidateId !== null ? 'Edit candidate' : 'Add a candidate'}</h2>
          <p>Enter the applicant's details below.</p>
        </div>

        <button
          type="button"
          className="close-button"
          onClick={() => setShowCandidateForm(false)}
          aria-label="Close form"
        >
          <X size={20} />
        </button>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault()


if (editingCandidateId !== null) {

setCandidates((currentCandidates) =>
  currentCandidates.map((candidate) => {
    if (candidate.id !== editingCandidateId) {
      return candidate
    }

    const activityEntry = {
      id: Date.now(),
      message: 'Candidate profile updated',
      date: new Date().toISOString(),
    }

    return {
      ...candidate,
      name: candidateForm.name.trim(),
      email: candidateForm.email.trim(),
      skills: candidateForm.skills.trim(),
      jobId: Number(candidateForm.jobId),
      status: candidateForm.status,
      activity: [
        ...(candidate.activity || []),
        activityEntry,
      ],
    }
  })
)

  setCandidateMessage(
    `${candidateForm.name.trim()} was updated successfully.`
  )
} else {

const newCandidate = {
  id: Date.now(),
  name: candidateForm.name.trim(),
  email: candidateForm.email.trim(),
  skills: candidateForm.skills.trim(),
  jobId: Number(candidateForm.jobId),
  status: candidateForm.status,
  activity: [
    {
      id: Date.now(),
      message: 'Candidate added',
      date: new Date().toISOString(),
    },
  ],
}

  setCandidates((currentCandidates) => [
    newCandidate,
    ...currentCandidates,
  ])

  setCandidateMessage(
    `${newCandidate.name} was added successfully.`
  )
}

setEditingCandidateId(null)

          setCandidateForm({
            name: '',
            email: '',
            skills: '',
            jobId: '',
            status: 'Applied',
          })

          setShowCandidateForm(false)
        }}
      >
        <label>
          Candidate name *
          <input
            required
            value={candidateForm.name}
            onChange={(event) =>
              setCandidateForm({
                ...candidateForm,
                name: event.target.value,
              })
            }
            placeholder="e.g. Ananya Sharma"
          />
        </label>

        <label>
          Email address *
          <input
            required
            type="email"
            value={candidateForm.email}
            onChange={(event) =>
              setCandidateForm({
                ...candidateForm,
                email: event.target.value,
              })
            }
            placeholder="e.g. ananya@example.com"
          />
        </label>

        <label>
          Skills *
          <input
            required
            value={candidateForm.skills}
            onChange={(event) =>
              setCandidateForm({
                ...candidateForm,
                skills: event.target.value,
              })
            }
            placeholder="e.g. React, JavaScript, CSS"
          />
        </label>

        <label>
          Applied for *
          <select
            required
            value={candidateForm.jobId}
            onChange={(event) =>
              setCandidateForm({
                ...candidateForm,
                jobId: event.target.value,
              })
            }
          >
            <option value="">Select a job</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </label>

        <label>
          Application status
          <select
            value={candidateForm.status}
            onChange={(event) =>
              setCandidateForm({
                ...candidateForm,
                status: event.target.value,
              })
            }
          >
            <option value="Applied">Applied</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
            <option value="Offer Sent">Offer Sent</option>
          </select>
        </label>

        <div className="job-form-actions">
          <button
            type="button"
            className="secondary-button"
onClick={() => {
  setShowCandidateForm(false)
  setEditingCandidateId(null)
}}
>
            Cancel
          </button>

          <button type="submit" className="primary-button">
            <Plus size={16} />
            Save Candidate
          </button>
        </div>
      </form>
    </section>
  </div>
)}

<section className="jobs-section" id="candidates">
  {candidateMessage && (
  <div className="job-message">{candidateMessage}</div>
)}
  <div className="jobs-heading">
    <div>
      <h2>Candidate Management</h2>
      <p>Manage your applicants and track their progress.</p>
    </div>


<button
  className="post-job-button"
  type="button"
  onClick={() => {
    setCandidateMessage('')
    setShowCandidateForm(true)
  }}
>
  <Plus size={16} />
  Add Candidate
</button>

  </div>

  <div className="jobs-list">


<div className="candidate-toolbar">
  <div className="search-box">
    <input
      type="text"
      placeholder="Search name, email, or skills"
      value={candidateSearch}
      onChange={(event) => setCandidateSearch(event.target.value)}
    />
  </div>

  <div className="candidate-filter">
    <select
      value={candidateStatusFilter}
      onChange={(event) => setCandidateStatusFilter(event.target.value)}
      aria-label="Filter candidates by status"
    >
      <option value="All">All statuses</option>
      <option value="Applied">Applied</option>
      <option value="Shortlisted">Shortlisted</option>
      <option value="Interview">Interview</option>
      <option value="Rejected">Rejected</option>
      <option value="Offer Sent">Offer Sent</option>
    </select>
  </div>
</div>
<p className="candidate-results-count">
  {candidates.filter((candidate) => {
    const matchesSearch =
      `${candidate.name} ${candidate.email} ${candidate.skills}`
        .toLowerCase()
        .includes(candidateSearch.toLowerCase())

    const matchesStatus =
      candidateStatusFilter === 'All' ||
      candidate.status === candidateStatusFilter

    return matchesSearch && matchesStatus
  }).length}{' '}
  {candidates.filter((candidate) => {
    const matchesSearch =
      `${candidate.name} ${candidate.email} ${candidate.skills}`
        .toLowerCase()
        .includes(candidateSearch.toLowerCase())

    const matchesStatus =
      candidateStatusFilter === 'All' ||
      candidate.status === candidateStatusFilter

    return matchesSearch && matchesStatus
  }).length === 1 ? 'candidate found' : 'candidates found'}
</p>

{candidates
  .filter((candidate) => {
    const matchesSearch =
      `${candidate.name} ${candidate.email} ${candidate.skills}`
        .toLowerCase()
        .includes(candidateSearch.toLowerCase())

    const matchesStatus =
      candidateStatusFilter === 'All' ||
      candidate.status === candidateStatusFilter

    return matchesSearch && matchesStatus
  })
  .map((candidate) => (

      <article className="job-card" key={candidate.id}>
        <div className="job-card-top">
          <div className="job-title-area">
            <h3>{candidate.name}</h3>
            <p>{candidate.email}</p>
          </div>

<select
  className="candidate-status-select"
  value={candidate.status}
  onChange={(event) =>
    updateCandidateStatus(candidate.id, event.target.value)
  }
  aria-label={`Update status for ${candidate.name}`}
>
  <option value="Applied">Applied</option>
  <option value="Shortlisted">Shortlisted</option>
  <option value="Interview">Interview</option>
  <option value="Rejected">Rejected</option>
  <option value="Offer Sent">Offer Sent</option>
</select>

        </div>

        <div className="job-details">
          <span>Skills: {candidate.skills}</span>
          <span>
            Job: {
              jobs.find((job) => job.id === candidate.jobId)?.title
              || 'Job no longer available'
            }
          </span>
        </div>

<div className="job-management-actions">
  <button
    type="button"
    className="job-action-button"
    onClick={() => {
      setEditingCandidateId(candidate.id)
      setCandidateForm({
        name: candidate.name,
        email: candidate.email,
        skills: candidate.skills,
        jobId: String(candidate.jobId),
        status: candidate.status,
      })
      setCandidateMessage('')
      setShowCandidateForm(true)
    }}
  >
    Edit Candidate
  </button>
  <button
  type="button"
  className="job-action-button"
  onClick={() => setViewingCandidate(candidate)}
>
  View Details
</button>
  <button
  type="button"
  className="job-action-button"
  onClick={() => deleteCandidate(candidate.id)}
>
  Delete Candidate
</button>
</div>

      </article>

    ))}

  {candidates.filter((candidate) => {
    const matchesSearch =
      `${candidate.name} ${candidate.email} ${candidate.skills}`
        .toLowerCase()
        .includes(candidateSearch.toLowerCase())

    const matchesStatus =
      candidateStatusFilter === 'All' ||
      candidate.status === candidateStatusFilter

    return matchesSearch && matchesStatus
  }).length === 0 && (
    <div className="jobs-empty">
      <h3>No candidates found</h3>
      <p>
        Try another search or choose a different status filter.
      </p>
    </div>
  )}
</div>

</section>


{viewingCandidate && (
  <div className="job-modal-backdrop">
    <section className="job-modal">
      <div className="job-modal-header">
        <div>
          <p className="eyebrow">CANDIDATE PROFILE</p>
          <h2>{viewingCandidate.name}</h2>
          <p>Candidate application details</p>
        </div>

        <button
          type="button"
          className="close-button"
          onClick={() => setViewingCandidate(null)}
          aria-label="Close candidate details"
        >
          <X size={20} />
        </button>
      </div>

      <div className="job-skills">
        <strong>Email address</strong>
        <p>{viewingCandidate.email}</p>
      </div>

      <div className="job-skills">
        <strong>Skills</strong>
        <p>{viewingCandidate.skills || 'Not specified'}</p>
      </div>

      <div className="job-skills">
        <strong>Applied job</strong>
        <p>
          {jobs.find(
            (job) => job.id === viewingCandidate.jobId
          )?.title || 'Job no longer available'}
        </p>
      </div>

      <div className="job-skills">
        <strong>Application status</strong>
        <p>{viewingCandidate.status}</p>
      </div>

{viewingCandidate.interviewDate && (
  <div className="candidate-interview-card">
    <div className="candidate-interview-heading">
      <div>
        <span className="candidate-interview-label">
          SCHEDULED INTERVIEW
        </span>
        <h3>
          {new Date(viewingCandidate.interviewDate).toLocaleDateString(
            undefined,
            {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }
          )}
        </h3>
        <p>
          {new Date(viewingCandidate.interviewDate).toLocaleTimeString(
            undefined,
            {
              hour: 'numeric',
              minute: '2-digit',
            }
          )}
        </p>
      </div>

      <span className="candidate-interview-type">
        {viewingCandidate.interviewType}
      </span>
    </div>
  </div>
)}

<div className="candidate-activity">
  <h3>Activity Timeline</h3>

  {viewingCandidate.activity &&
  viewingCandidate.activity.length > 0 ? (
    <div className="candidate-activity-list">
      {viewingCandidate.activity
        .slice()
        .reverse()
        .map((activity) => (
          <div className="candidate-activity-item" key={activity.id}>
            <div className="candidate-activity-dot" />

            <div>
              <strong>{activity.message}</strong>
              <p>
                {new Date(activity.date).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
    </div>
  ) : (
    <p>No activity recorded for this candidate yet.</p>
  )}
</div>


<div className="job-form-actions candidate-profile-actions">
  <button
    type="button"
    className="secondary-button"
    onClick={() => setViewingCandidate(null)}
  >
    Close
  </button>

  <button
    type="button"
    className="secondary-button"
    onClick={() => {
      const candidate = viewingCandidate
      setViewingCandidate(null)
      setEditingCandidateId(candidate.id)
      setCandidateForm({
        name: candidate.name,
        email: candidate.email,
        skills: candidate.skills,
        jobId: String(candidate.jobId),
        status: candidate.status,
      })
      setCandidateMessage('')
      setShowCandidateForm(true)
    }}
  >
    Edit Candidate
  </button>

  <button
    type="button"
    className="primary-button"
    onClick={() => {
      setInterviewDate('')
      setInterviewType('Video call')
      setShowInterviewForm(true)
    }}
  >
    Schedule Interview
  </button>
</div>

    </section>
  </div>
)}

{showInterviewForm && (
  <div className="job-modal-backdrop">
    <section className="job-modal">
      <div className="job-modal-header">
        <div>
          <h2>Schedule Interview</h2>
          <p>
            Arrange an interview with {viewingCandidate?.name}.
          </p>
        </div>

        <button
          type="button"
          className="icon-button"
          onClick={() => setShowInterviewForm(false)}
          aria-label="Close interview form"
        >
          <X size={20} />
        </button>
      </div>


<form
  onSubmit={(event) => {
    event.preventDefault()

    const activityEntry = {
      id: Date.now(),
      message: `Interview scheduled for ${new Date(interviewDate).toLocaleString()} (${interviewType})`,
      date: new Date().toISOString(),
    }

    setCandidates((currentCandidates) =>
      currentCandidates.map((candidate) =>
        candidate.id === viewingCandidate.id
          ? {
              ...candidate,
              interviewDate,
              interviewType,
              interviewStatus: 'Scheduled',
              activity: [
                ...(candidate.activity || []),
                activityEntry,
              ],
            }
          : candidate
      )
    )

    setViewingCandidate((currentCandidate) =>
      currentCandidate
        ? {
            ...currentCandidate,
            interviewDate,
            interviewType,
            interviewStatus: 'Scheduled',
            activity: [
              ...(currentCandidate.activity || []),
              activityEntry,
            ],
          }
        : currentCandidate
    )

    setShowInterviewForm(false)
  }}
>
  <div className="form-group">
    <label htmlFor="interview-date">Interview date and time</label>
    <input
      id="interview-date"
      type="datetime-local"
      value={interviewDate}
      onChange={(event) => setInterviewDate(event.target.value)}
      required
    />
  </div>

  <div className="form-group">
    <label htmlFor="interview-type">Interview type</label>
    <select
      id="interview-type"
      value={interviewType}
      onChange={(event) => setInterviewType(event.target.value)}
    >
      <option value="Video call">Video call</option>
      <option value="In-person">In-person</option>
      <option value="Phone call">Phone call</option>
    </select>
  </div>

  <div className="job-form-actions">
    <button
      type="button"
      className="secondary-button"
      onClick={() => setShowInterviewForm(false)}
    >
      Cancel
    </button>

    <button type="submit" className="primary-button">
      Save Interview
    </button>
  </div>
</form>
    </section>
  </div>
)}


        <section className="content-grid">
          <article className="panel">
            <div className="panel-heading">
              <div>
                <h3>Recent Candidates</h3>
                <p>Your latest applicants</p>
              </div>
              <a href="#candidates">View all →</a>
            </div>

            <div className="candidate-row">
              <div className="candidate-avatar purple">AM</div>
              <div className="candidate-info">
                <strong>Alex Morgan</strong>
                <p>Frontend Developer</p>
              </div>
              <span className="status shortlisted">Shortlisted</span>
            </div>

            <div className="candidate-row">
              <div className="candidate-avatar orange">SP</div>
              <div className="candidate-info">
                <strong>Sam Patel</strong>
                <p>Data Analyst</p>
              </div>
              <span className="status review">In Review</span>
            </div>

            <div className="candidate-row">
              <div className="candidate-avatar green">JR</div>
              <div className="candidate-info">
                <strong>Jordan Rivera</strong>
                <p>Product Designer</p>
              </div>
              <span className="status interview">Interview</span>
            </div>

            <div className="candidate-row">
              <div className="candidate-avatar blue">TK</div>
              <div className="candidate-info">
                <strong>Taylor Kim</strong>
                <p>Backend Developer</p>
              </div>
              <span className="status shortlisted">Shortlisted</span>
            </div>
          </article>

          <article className="panel pipeline-panel">
            <div className="panel-heading">
              <div>
                <h3>Hiring Pipeline</h3>
                <p>Candidate progress</p>
              </div>
            </div>

            <div className="pipeline-item">
              <div><span>Applied</span><strong>86</strong></div>
              <div className="progress-track"><div className="progress-fill applied-fill" style={{ width: '88%' }} /></div>
            </div>
            <div className="pipeline-item">
              <div><span>Screening</span><strong>54</strong></div>
              <div className="progress-track"><div className="progress-fill screening-fill" style={{ width: '65%' }} /></div>
            </div>
            <div className="pipeline-item">
              <div><span>Interview</span><strong>32</strong></div>
              <div className="progress-track"><div className="progress-fill interview-fill" style={{ width: '42%' }} /></div>
            </div>
            <div className="pipeline-item">
              <div><span>Offer</span><strong>12</strong></div>
              <div className="progress-track"><div className="progress-fill offer-fill" style={{ width: '22%' }} /></div>
            </div>

            <div className="pipeline-footer">
              <span>Demo data</span>
              <span>Updated for preview</span>
            </div>
          </article>

<article className="panel upcoming-interviews-panel">
  <div className="panel-heading">
    <div>
      <h3>Upcoming Interviews</h3>
      <p>Your interview schedule</p>
    </div>
    <span className="interview-count">
      {
        candidates.filter(
          (candidate) =>
            candidate.interviewDate &&
            new Date(candidate.interviewDate) >= new Date()
        ).length
      }
    </span>
  </div>

  {candidates
    .filter(
      (candidate) =>
        candidate.interviewDate &&
        new Date(candidate.interviewDate) >= new Date()
    )
    .sort(
      (a, b) =>
        new Date(a.interviewDate) - new Date(b.interviewDate)
    ).length > 0 ? (
    candidates
      .filter(
        (candidate) =>
          candidate.interviewDate &&
          new Date(candidate.interviewDate) >= new Date()
      )
      .sort(
        (a, b) =>
          new Date(a.interviewDate) - new Date(b.interviewDate)
      )
      .map((candidate) => (
        <button
          type="button"
          className="upcoming-interview-row"
          key={candidate.id}
          onClick={() => setViewingCandidate(candidate)}
        >
          <div className="upcoming-interview-date">
            <strong>
              {new Date(candidate.interviewDate).toLocaleDateString(
                undefined,
                { day: '2-digit' }
              )}
            </strong>
            <span>
              {new Date(candidate.interviewDate).toLocaleDateString(
                undefined,
                { month: 'short' }
              )}
            </span>
          </div>

<div className="upcoming-interview-info">
  <strong>{candidate.name}</strong>

  <p>
    {jobs.find(
      (job) => String(job.id) === String(candidate.jobId)
    )?.title || 'Candidate interview'}
  </p>

  <span>
    {new Date(candidate.interviewDate).toLocaleTimeString(
      undefined,
      { hour: 'numeric', minute: '2-digit' }
    )} · {candidate.interviewType}
  </span>

  <select
    className="interview-status-select"
    value={candidate.interviewStatus || 'Scheduled'}
    onClick={(event) => event.stopPropagation()}
    onChange={(event) => {
      const newStatus = event.target.value

      setCandidates((currentCandidates) =>
        currentCandidates.map((item) =>
          item.id === candidate.id
            ? {
                ...item,
                interviewStatus: newStatus,
                activity: [
                  ...(item.activity || []),
                  {
                    id: Date.now(),
                    message: `Interview status changed to ${newStatus}`,
                    date: new Date().toISOString(),
                  },
                ],
              }
            : item
        )
      )

      setViewingCandidate((currentCandidate) =>
        currentCandidate?.id === candidate.id
          ? {
              ...currentCandidate,
              interviewStatus: newStatus,
              activity: [
                ...(currentCandidate.activity || []),
                {
                  id: Date.now(),
                  message: `Interview status changed to ${newStatus}`,
                  date: new Date().toISOString(),
                },
              ],
            }
          : currentCandidate
      )
    }}
  >
    <option value="Scheduled">Scheduled</option>
    <option value="Completed">Completed</option>
    <option value="Cancelled">Cancelled</option>
  </select>
</div>

        </button>
      ))
  ) : (
    <div className="upcoming-interviews-empty">
      <p>No upcoming interviews</p>
      <span>Schedule an interview from a candidate's profile.</span>
    </div>
  )}
</article>

        </section>

        <footer className="footer">
          HireSense AI <span>•</span> Intelligent hiring, with humans in control.
        </footer>
      </main>
    </div>
  )
}

export default App