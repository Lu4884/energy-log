import { NavLink } from 'react-router-dom'
import { Home, PlusCircle, BarChart3, User } from 'lucide-react'
import styles from './Layout.module.css'

const tabs = [
  { path: '/', label: '首页', icon: Home },
  { path: '/record', label: '记录', icon: PlusCircle },
  { path: '/insights', label: '洞察', icon: BarChart3 },
  { path: '/me', label: '我的', icon: User },
]

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div className={styles.container}>
      <div className={styles.content}>{children}</div>
      <nav className={styles.nav}>
        {tabs.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <Icon className={styles.navIcon} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
