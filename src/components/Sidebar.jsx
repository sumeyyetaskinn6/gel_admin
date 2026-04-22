import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { sidebarSections } from '../constants/sidebarMenu'
import './Sidebar.css'

function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function Sidebar({ onLogout }) {
  const location = useLocation()
  const [mobileAppsOpen, setMobileAppsOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const isMobileAppsRoute = location.pathname.startsWith('/dashboard/app')
  const isMobileAppsOpen = mobileAppsOpen || isMobileAppsRoute

  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!drawerOpen) return
    const mq = window.matchMedia('(max-width: 1024px)')
    if (!mq.matches) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [drawerOpen])

  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawerOpen])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1025px)')
    const onChange = () => {
      if (mq.matches) setDrawerOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const closeDrawer = () => setDrawerOpen(false)

  return (
    <>
      <header className="sidebar-mobile-topbar">
        <button
          type="button"
          className="sidebar-burger"
          aria-label={drawerOpen ? 'Menüyü kapat' : 'Menüyü aç'}
          aria-expanded={drawerOpen}
          aria-controls="dashboard-sidebar"
          onClick={() => setDrawerOpen((o) => !o)}
        >
          {drawerOpen ? <CloseIcon /> : <HamburgerIcon />}
        </button>
        <span className="sidebar-mobile-topbar__title">Gel Yönetim</span>
      </header>

      {drawerOpen ? (
        <div className="sidebar-backdrop" role="presentation" aria-hidden onClick={closeDrawer} />
      ) : null}

      <aside
        id="dashboard-sidebar"
        className={`sidebar${drawerOpen ? ' sidebar--open' : ''}`}
      >
      <div className="sidebar-inner">
        <div className="sidebar-top">
          <div className="sidebar-brand-row">
            <img className="sidebar-logo" src="/logo.png" alt="Gel uygulama logosu" />
            <button
              type="button"
              className="sidebar-drawer-close"
              aria-label="Menüyü kapat"
              onClick={closeDrawer}
            >
              <CloseIcon />
            </button>
          </div>

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
                            onClick={closeDrawer}
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
                        onClick={closeDrawer}
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
            onClick={closeDrawer}
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
    </>
  )
}

export default Sidebar
