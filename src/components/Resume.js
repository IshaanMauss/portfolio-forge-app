import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ToggleSwitch from './ToggleSwitch';
import './Resume.css';

function Resume() {
  const { userId } = useParams();
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyTheme, setApplyTheme] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!userId) return;
      const docRef = doc(db, "portfolios", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const fullData = docSnap.data();
        const activeVersionId = fullData.meta?.activeVersion || 'default';
        setPortfolioData(fullData.portfolios[activeVersionId]);
      }
      setLoading(false);
    };
    fetchPortfolio();
  }, [userId]);

  const formatUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  const isFutureYear = (year) => {
    if (!year || isNaN(year)) return false;
    const currentYear = new Date().getFullYear();
    return parseInt(year) > currentYear;
  };

  const exportToPdf = () => {
    const resumeElement = document.getElementById('resume-content');
    html2canvas(resumeElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: applyTheme ? portfolioData.theme.backgroundColor : '#ffffff',
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${userName}_Resume.pdf`);
    });
  };

  if (loading) return <div className="loading-screen">Loading Resume...</div>;
  if (!portfolioData) return <div className="loading-screen">Could not find resume data.</div>;

  const {
    userName, userSubtitle, location, links, bio, 
    hardSkills = { items: [] }, 
    softSkills = { items: [] },
    interests = { items: [] },
    certifications = { items: [] }, 
    projects = { items: [] }, 
    education, profilePicUrl, theme
  } = portfolioData;

  const themedStyles = {
    container: { backgroundColor: theme.backgroundColor, color: theme.textColor },
    header: { borderBottomColor: theme.accentColor },
    h1: { color: theme.textColor },
    subtitle: { color: theme.accentColor },
    h2: { color: theme.textColor, borderBottomColor: theme.accentColor },
    skillTag: { backgroundColor: theme.accentColor, color: theme.backgroundColor }
  };

  return (
    <>
      <div className="resume-actions">
        <div className="theme-toggle-wrapper">
          <ToggleSwitch label="Apply Portfolio Theme" checked={applyTheme} onChange={() => setApplyTheme(!applyTheme)} />
        </div>
        <button onClick={exportToPdf}>Download as PDF</button>
      </div>
      <div id="resume-content" className={`resume-container ${applyTheme ? 'theme-applied' : ''}`} style={applyTheme ? themedStyles.container : {}}>
        <header className="resume-header" style={applyTheme ? themedStyles.header : {}}>
          {profilePicUrl && <img src={profilePicUrl} alt="Profile" crossOrigin="anonymous" className="profile-pic-resume" />}
          <h1 style={applyTheme ? themedStyles.h1 : {}}>{userName}</h1>
          <p className="subtitle" style={applyTheme ? themedStyles.subtitle : {}}>{userSubtitle}</p>
          <div className="contact-info">
            <span>{location?.value}</span>
            {links?.email && <> | <a href={`mailto:${links.email}`}>{links.email}</a></>}
            {links?.linkedin && <> | <a href={formatUrl(links.linkedin)} target="_blank" rel="noopener noreferrer">LinkedIn</a></>}
            {links?.github && <> | <a href={formatUrl(links.github)} target="_blank" rel="noopener noreferrer">GitHub</a></>}
          </div>
        </header>
        <main className="resume-main">
          <div className="main-col-resume">
            <section><h2 style={applyTheme ? themedStyles.h2 : {}}>About Me</h2><p>{bio}</p></section>
            {projects?.showOnPage && projects.items.length > 0 && <section><h2 style={applyTheme ? themedStyles.h2 : {}}>Projects</h2>{projects.items.map((p, i) => (<div key={i} className="project-item-resume"><h3>{p.title}</h3><p>{p.description}</p></div>))}</section>}
            {certifications?.showOnPage && certifications.items.length > 0 && <section><h2 style={applyTheme ? themedStyles.h2 : {}}>Certifications</h2>{certifications.items.map((c, i) => (<div key={i} className="project-item-resume"><h3>{c.name}</h3><p>{c.issuer}</p></div>))}</section>}
          </div>
          <div className="sidebar-col-resume">
            {hardSkills?.showOnPage && hardSkills.items.length > 0 && <section><h2 style={applyTheme ? themedStyles.h2 : {}}>Hard Skills</h2><ul className="skills-list-resume">{hardSkills.items.map(s => <li key={s} style={applyTheme ? themedStyles.skillTag : {}}>{s}</li>)}</ul></section>}
            {softSkills?.showOnPage && softSkills.items.length > 0 && <section><h2 style={applyTheme ? themedStyles.h2 : {}}>Soft Skills</h2><ul className="skills-list-resume">{softSkills.items.map(s => <li key={s} style={applyTheme ? themedStyles.skillTag : {}}>{s}</li>)}</ul></section>}
            {interests?.showOnPage && interests.items.length > 0 && <section><h2 style={applyTheme ? themedStyles.h2 : {}}>Interests</h2><ul className="skills-list-resume">{interests.items.map(i => <li key={i} style={applyTheme ? themedStyles.skillTag : {}}>{i}</li>)}</ul></section>}
            {(education?.college?.showOnPage || education?.class12?.showOnPage || education?.class10?.showOnPage) && (
              <section>
                <h2 style={applyTheme ? themedStyles.h2 : {}}>Education</h2>
                {education.college?.showOnPage && (
                  <div className="education-item-resume">
                    <h3>{education.college.name}</h3>
                    <p>{education.college.course} - {education.college.gradYear}
                      {isFutureYear(education.college.gradYear) && <span className="expected-year"> (Expected)</span>}
                    </p>
                  </div>
                )}
                {education.class12?.showOnPage && (
                  <div className="education-item-resume">
                    <h3>Class XII - {education.class12.board}</h3>
                    <p>{education.class12.school}, {education.class12.passingYear}</p>
                    <p>Percentage: {education.class12.percentage}%</p>
                  </div>
                )}
                {education.class10?.showOnPage && (
                  <div className="education-item-resume">
                    <h3>Class X - {education.class10.board}</h3>
                    <p>{education.class10.school}, {education.class10.passingYear}</p>
                    <p>Percentage: {education.class10.percentage}%</p>
                  </div>
                )}
              </section>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default Resume;