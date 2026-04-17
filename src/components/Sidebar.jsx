import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { sidebarSections } from '../constants/sidebarMenu'
import './Sidebar.css'

function Sidebar({ onLogout }) {
  const location = useLocation()
  const [mobileAppsOpen, setMobileAppsOpen] = useState(false)
  const isMobileAppsRoute = location.pathname.startsWith('/dashboard/app')
  const isMobileAppsOpen = mobileAppsOpen || isMobileAppsRoute

  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        <div className="sidebar-top">
          <img className="sidebar-logo" src="/logo.png" alt="Gel uygulama logosu" />

          <div className="sidebar-nav-stack">
            {sidebarSections.map((section) => {
              const isMobileAppsSection = section.title?.toLowerCase() === 'mobil uygulama'

              if (isMobileAppsSection) {
                return (
                  <nav key={section.title} className="sidebar-menu-block" aria-label={section.title}>
                    <button
                      type="button"
                      className="sidebar-accordion-trigger"
                      aria-expanded={isMobileAppsOpen}
                      aria-controls="sidebar-mobile-apps-submenu"
                      onClick={() => setMobileAppsOpen((prev) => !prev)}
                    >
                      <span className="sidebar-section-title">{section.title}</span>
                      <svg
                        className={`sidebar-accordion-chevron${isMobileAppsOpen ? ' sidebar-accordion-chevron--open' : ''}`}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                      >
                        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>

                    <div
                      id="sidebar-mobile-apps-submenu"
                      className={`sidebar-collapsible${isMobileAppsOpen ? ' sidebar-collapsible--open' : ''}`}
                    >
                      <div className="sidebar-menu sidebar-menu--nested">
                        {section.items.map((item) => (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                              `sidebar-menu-item sidebar-menu-item--nested${isActive ? ' sidebar-menu-item--active' : ''}`
                            }
                          >
                            {item.label}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </nav>
                )
              }

              return (
                <nav
                  key={section.title ?? 'main'}
                  className="sidebar-menu-block"
                  aria-label={section.title ? section.title : 'Ana menü'}
                >
                  {section.title ? <p className="sidebar-section-title">{section.title}</p> : null}
                  <div className="sidebar-menu">
                    {section.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          `sidebar-menu-item${isActive ? ' sidebar-menu-item--active' : ''}`
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </nav>
              )
            })}
          </div>
        </div>

        <div className="sidebar-bottom">
          <NavLink
            to="/dashboard/admin-profile"
            className={({ isActive }) => `sidebar-profile${isActive ? ' sidebar-profile--active' : ''}`}
            aria-label="Admin profil sayfasını aç"
          >
            <div>
              <p className="sidebar-profile-name">Ümit Cengiz Aktoprak</p>
              <p className="sidebar-profile-link">Profili Görüntüle</p>
            </div>
            <span className="sidebar-profile-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </NavLink>

          <button type="button" className="sidebar-logout" onClick={onLogout}>
            Çıkış Yap
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
